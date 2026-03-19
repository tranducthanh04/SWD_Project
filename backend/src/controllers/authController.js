const { successResponse } = require('../utils/apiResponse');
const catchAsync = require('../utils/catchAsync');
const authService = require('../services/authService');

const register = catchAsync(async (req, res) => {
  const data = await authService.register(req.body);
  successResponse(res, { statusCode: 201, message: 'Registration successful. Please verify your email.', data });
});

const verifyEmail = catchAsync(async (req, res) => {
  const data = await authService.verifyEmail(req.body);
  successResponse(res, { message: 'Email verified successfully', data });
});

const login = catchAsync(async (req, res) => {
  const data = await authService.login(req.body);
  successResponse(res, { message: 'Login successful', data });
});

const googleLogin = catchAsync(async (req, res) => {
  const data = await authService.googleLogin(req.body);
  successResponse(res, { message: 'Google login successful', data });
});

const forgotPassword = catchAsync(async (req, res) => {
  const data = await authService.forgotPassword(req.body);
  successResponse(res, { message: 'Password reset code sent successfully', data });
});

const resetPassword = catchAsync(async (req, res) => {
  const data = await authService.resetPassword(req.body);
  successResponse(res, { message: data.message, data });
});

const changePassword = catchAsync(async (req, res) => {
  const data = await authService.changePassword({ userId: req.user._id, ...req.body });
  successResponse(res, { message: data.message, data });
});

const logout = catchAsync(async (req, res) => {
  const data = await authService.logout(req.body.refreshToken);
  successResponse(res, { message: data.message });
});

const refreshToken = catchAsync(async (req, res) => {
  const data = await authService.refreshToken(req.body.refreshToken);
  successResponse(res, { message: 'Token refreshed successfully', data });
});

const me = catchAsync(async (req, res) => {
  const data = await authService.getMe(req.user._id);
  successResponse(res, { data });
});

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
  me,
};
