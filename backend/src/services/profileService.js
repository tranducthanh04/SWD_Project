const EnterpriseProfile = require('../models/EnterpriseProfile');
const EnterpriseProfileUpdateRequest = require('../models/EnterpriseProfileUpdateRequest');
const JobSeekerProfile = require('../models/JobSeekerProfile');
const User = require('../models/User');
const AppError = require('../utils/AppError');
const { buildFileUrl } = require('../utils/fileStorage');
const { parseArrayInput } = require('../utils/parsers');
const { calculateJobSeekerProfileCompleted } = require('../utils/profile');
const { sanitizeUser } = require('../utils/serializers');
const { logAction } = require('./auditLogService');

const getMyProfile = async (user) => {
  const safeUser = sanitizeUser(user);

  if (user.role === 'jobseeker') {
    const profile = await JobSeekerProfile.findOne({ userId: user._id });
    return {
      user: safeUser,
      profile,
    };
  }

  if (user.role === 'enterprise') {
    const profile = await EnterpriseProfile.findOne({ userId: user._id });
    const latestRequest = await EnterpriseProfileUpdateRequest.findOne({ enterpriseId: user._id }).sort({ createdAt: -1 });
    return {
      user: safeUser,
      profile,
      latestRequest,
    };
  }

  return {
    user: safeUser,
  };
};

const updateJobSeekerProfile = async (userId, payload, files = {}) => {
  const user = await User.findById(userId);
  const profile = await JobSeekerProfile.findOne({ userId });

  if (!user || !profile) {
    throw new AppError('Không tìm thấy hồ sơ ứng viên', 404);
  }

  const avatarFile = files.avatar?.[0];
  const cvFile = files.cvFile?.[0];

  if (payload.fullName) user.fullName = payload.fullName;
  if (payload.phone !== undefined) user.phone = payload.phone;
  if (payload.address !== undefined) user.address = payload.address;
  if (avatarFile) user.avatar = buildFileUrl('avatars', avatarFile.filename);
  await user.save();

  if (payload.dateOfBirth) profile.dateOfBirth = payload.dateOfBirth;
  if (payload.experienceYears !== undefined) profile.experienceYears = Number(payload.experienceYears);
  if (payload.education !== undefined) profile.education = payload.education;
  if (payload.summary !== undefined) profile.summary = payload.summary;
  if (payload.skills !== undefined) profile.skills = parseArrayInput(payload.skills);
  if (payload.favouriteTags !== undefined) profile.favouriteTags = parseArrayInput(payload.favouriteTags);
  if (cvFile) profile.cvFileUrl = buildFileUrl('cvs', cvFile.filename);
  profile.profileCompleted = calculateJobSeekerProfileCompleted(profile);
  await profile.save();

  return getMyProfile(user);
};

const requestEnterpriseProfileUpdate = async (enterpriseId, payload, files = {}) => {
  const user = await User.findById(enterpriseId);
  const profile = await EnterpriseProfile.findOne({ userId: enterpriseId });

  if (!user || !profile) {
    throw new AppError('Không tìm thấy hồ sơ doanh nghiệp', 404);
  }

  const existingPending = await EnterpriseProfileUpdateRequest.findOne({
    enterpriseId,
    status: 'pending',
  });

  if (existingPending) {
    throw new AppError('Đã có yêu cầu cập nhật hồ sơ đang chờ duyệt', 409);
  }

  const logoFile = files.logo?.[0];
  const newData = {
    companyName: payload.companyName ?? profile.companyName,
    companyEmail: payload.companyEmail ?? profile.companyEmail,
    companyPhone: payload.companyPhone ?? profile.companyPhone,
    companyAddress: payload.companyAddress ?? profile.companyAddress,
    taxCode: payload.taxCode ?? profile.taxCode,
    website: payload.website ?? profile.website,
    description: payload.description ?? profile.description,
    logo: logoFile ? buildFileUrl('logos', logoFile.filename) : profile.logo,
  };

  const request = await EnterpriseProfileUpdateRequest.create({
    enterpriseId,
    oldData: profile.toObject(),
    newData,
    status: 'pending',
  });

  await logAction({
    actorId: user._id,
    actorRole: user.role,
    action: 'ENTERPRISE_PROFILE_UPDATE_REQUESTED',
    targetType: 'EnterpriseProfileUpdateRequest',
    targetId: request._id,
    metadata: newData,
  });

  return request;
};

const getEnterpriseRequestStatus = async (enterpriseId) => {
  const request = await EnterpriseProfileUpdateRequest.findOne({ enterpriseId }).sort({ createdAt: -1 });
  return request;
};

const approveEnterpriseProfileUpdateRequest = async (requestId, adminId, note = '') => {
  const request = await EnterpriseProfileUpdateRequest.findById(requestId);

  if (!request) {
    throw new AppError('Không tìm thấy yêu cầu cập nhật doanh nghiệp', 404);
  }

  if (request.status !== 'pending') {
    throw new AppError('Yêu cầu này đã được xem xét trước đó', 409);
  }

  const profile = await EnterpriseProfile.findOne({ userId: request.enterpriseId });
  if (!profile) {
    throw new AppError('Không tìm thấy hồ sơ doanh nghiệp', 404);
  }

  Object.assign(profile, request.newData, { verificationStatus: 'verified' });
  await profile.save();

  request.status = 'approved';
  request.reviewedBy = adminId;
  request.reviewedAt = new Date();
  request.note = note;
  await request.save();

  await logAction({
    actorId: adminId,
    actorRole: 'admin',
    action: 'ENTERPRISE_PROFILE_UPDATE_APPROVED',
    targetType: 'EnterpriseProfileUpdateRequest',
    targetId: request._id,
    metadata: { enterpriseId: request.enterpriseId, note },
  });

  return request;
};

const rejectEnterpriseProfileUpdateRequest = async (requestId, adminId, note = '') => {
  const request = await EnterpriseProfileUpdateRequest.findById(requestId);

  if (!request) {
    throw new AppError('Không tìm thấy yêu cầu cập nhật doanh nghiệp', 404);
  }

  if (request.status !== 'pending') {
    throw new AppError('Yêu cầu này đã được xem xét trước đó', 409);
  }

  request.status = 'rejected';
  request.reviewedBy = adminId;
  request.reviewedAt = new Date();
  request.note = note;
  await request.save();

  await EnterpriseProfile.updateOne({ userId: request.enterpriseId }, { verificationStatus: 'rejected' });

  await logAction({
    actorId: adminId,
    actorRole: 'admin',
    action: 'ENTERPRISE_PROFILE_UPDATE_REJECTED',
    targetType: 'EnterpriseProfileUpdateRequest',
    targetId: request._id,
    metadata: { enterpriseId: request.enterpriseId, note },
  });

  return request;
};

module.exports = {
  getMyProfile,
  updateJobSeekerProfile,
  requestEnterpriseProfileUpdate,
  getEnterpriseRequestStatus,
  approveEnterpriseProfileUpdateRequest,
  rejectEnterpriseProfileUpdateRequest,
};
