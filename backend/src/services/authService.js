const bcrypt = require('bcrypt');

const User = require('../models/User');
const JobSeekerProfile = require('../models/JobSeekerProfile');
const EnterpriseProfile = require('../models/EnterpriseProfile');
const RefreshToken = require('../models/RefreshToken');
const VerificationCode = require('../models/VerificationCode');
const AppError = require('../utils/AppError');
const { signAccessToken, signRefreshToken, verifyRefreshToken } = require('../utils/jwt');
const { generateOtpCode } = require('../utils/otp');
const { sanitizeUser } = require('../utils/serializers');
const { durationToMs } = require('../utils/time');
const { sendVerificationCodeEmail, sendResetPasswordCodeEmail } = require('./emailService');

const registerVerificationExpiresMs = 15 * 60 * 1000;

const createVerificationCode = async ({ userId, email, type }) => {
  await VerificationCode.updateMany({ email, type, used: false }, { used: true });

  const code = generateOtpCode();
  await VerificationCode.create({
    userId,
    email,
    code,
    type,
    expiresAt: new Date(Date.now() + registerVerificationExpiresMs),
  });

  return code;
};

const buildAuthPayload = async (user) => {
  const accessToken = signAccessToken({ sub: user._id.toString(), role: user.role });
  const refreshToken = signRefreshToken({ sub: user._id.toString(), role: user.role, type: 'refresh' });

  await RefreshToken.create({
    userId: user._id,
    token: refreshToken,
    expiresAt: new Date(Date.now() + durationToMs(process.env.JWT_REFRESH_EXPIRES_IN || '7d')),
  });

  return {
    accessToken,
    refreshToken,
    user: sanitizeUser(user),
  };
};

const register = async ({ username, email, fullName, password, gender, role }) => {
  const existingUser = await User.findOne({
    $or: [{ email: email.toLowerCase() }, { username }],
  });

  if (existingUser) {
    throw new AppError('Username or email is already in use', 409);
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({
    username,
    email: email.toLowerCase(),
    fullName,
    passwordHash,
    gender,
    role,
  });

  if (role === 'jobseeker') {
    await JobSeekerProfile.create({ userId: user._id });
  } else if (role === 'enterprise') {
    await EnterpriseProfile.create({
      userId: user._id,
      verificationStatus: 'pending',
      accountPlan: 'free',
    });
  }

  const code = await createVerificationCode({
    userId: user._id,
    email: user.email,
    type: 'register',
  });

  await sendVerificationCodeEmail(user.email, user.fullName, code);

  return {
    user: sanitizeUser(user),
    verificationSentTo: user.email,
  };
};

const verifyEmail = async ({ email, code }) => {
  const user = await User.findOne({ email: email.toLowerCase() });

  if (!user) {
    throw new AppError('User not found', 404);
  }

  const verificationCode = await VerificationCode.findOne({
    email: user.email,
    code,
    type: 'register',
    used: false,
    expiresAt: { $gt: new Date() },
  });

  if (!verificationCode) {
    throw new AppError('Invalid or expired verification code', 400);
  }

  verificationCode.used = true;
  await verificationCode.save();

  user.isEmailVerified = true;
  await user.save();

  return sanitizeUser(user);
};

const login = async ({ identifier, password }) => {
  const user = await User.findOne({
    $or: [{ email: identifier.toLowerCase() }, { username: identifier }],
  }).select('+passwordHash');

  if (!user) {
    throw new AppError('Invalid credentials', 401);
  }

  const passwordMatches = await user.comparePassword(password);
  if (!passwordMatches) {
    throw new AppError('Invalid credentials', 401);
  }

  if (!user.isEmailVerified) {
    throw new AppError('Please verify your email before logging in', 403);
  }

  if (!user.isActive || user.isBanned || user.deletedAt) {
    throw new AppError('This account is not allowed to log in', 403);
  }

  user.lastLoginAt = new Date();
  await user.save();

  return buildAuthPayload(user);
};

const googleLogin = async ({ email, fullName, role = 'jobseeker', avatar = '' }) => {
  let user = await User.findOne({ email: email.toLowerCase() });

  if (!user) {
    user = await User.create({
      username: email.split('@')[0],
      email: email.toLowerCase(),
      fullName,
      passwordHash: await bcrypt.hash(`Google-${Date.now()}`, 10),
      role,
      authProvider: 'google',
      isEmailVerified: true,
      avatar,
    });

    if (role === 'jobseeker') {
      await JobSeekerProfile.create({ userId: user._id });
    } else if (role === 'enterprise') {
      await EnterpriseProfile.create({ userId: user._id });
    }
  }

  if (!user.isActive || user.isBanned) {
    throw new AppError('This account is not allowed to log in', 403);
  }

  return buildAuthPayload(user);
};

const forgotPassword = async ({ username, email }) => {
  const user = await User.findOne({
    username,
    email: email.toLowerCase(),
  });

  if (!user) {
    throw new AppError('Username and email do not match', 404);
  }

  const code = await createVerificationCode({
    userId: user._id,
    email: user.email,
    type: 'reset_password',
  });

  await sendResetPasswordCodeEmail(user.email, user.fullName, code);

  return {
    resetSentTo: user.email,
  };
};

const resetPassword = async ({ username, email, code, newPassword }) => {
  const user = await User.findOne({
    username,
    email: email.toLowerCase(),
  }).select('+passwordHash');

  if (!user) {
    throw new AppError('Username and email do not match', 404);
  }

  const resetCode = await VerificationCode.findOne({
    email: user.email,
    code,
    type: 'reset_password',
    used: false,
    expiresAt: { $gt: new Date() },
  });

  if (!resetCode) {
    throw new AppError('Invalid or expired reset code', 400);
  }

  user.passwordHash = await bcrypt.hash(newPassword, 10);
  await user.save();

  resetCode.used = true;
  await resetCode.save();

  await RefreshToken.updateMany({ userId: user._id }, { isRevoked: true });

  return { message: 'Password reset successfully' };
};

const changePassword = async ({ userId, currentPassword, newPassword }) => {
  const user = await User.findById(userId).select('+passwordHash');

  if (!user) {
    throw new AppError('User not found', 404);
  }

  const matches = await user.comparePassword(currentPassword);
  if (!matches) {
    throw new AppError('Current password is incorrect', 400);
  }

  user.passwordHash = await bcrypt.hash(newPassword, 10);
  await user.save();
  await RefreshToken.updateMany({ userId: user._id }, { isRevoked: true });

  return { message: 'Password changed successfully' };
};

const logout = async (refreshToken) => {
  if (refreshToken) {
    await RefreshToken.updateOne({ token: refreshToken }, { isRevoked: true });
  }

  return { message: 'Logged out successfully' };
};

const refreshToken = async (token) => {
  const stored = await RefreshToken.findOne({
    token,
    isRevoked: false,
    expiresAt: { $gt: new Date() },
  });

  if (!stored) {
    throw new AppError('Refresh token is invalid or expired', 401);
  }

  const payload = verifyRefreshToken(token);
  const user = await User.findById(payload.sub);

  if (!user || !user.isActive || user.isBanned) {
    throw new AppError('User is not allowed to refresh session', 401);
  }

  stored.isRevoked = true;
  await stored.save();

  return buildAuthPayload(user);
};

const getMe = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError('User not found', 404);
  }

  return sanitizeUser(user);
};

module.exports = {
  register,
  verifyEmail,
  login,
  googleLogin,
  forgotPassword,
  resetPassword,
  changePassword,
  logout,
  refreshToken,
  getMe,
};
