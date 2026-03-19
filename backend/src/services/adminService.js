const User = require('../models/User');
const Job = require('../models/Job');
const Report = require('../models/Report');
const Tag = require('../models/Tag');
const Application = require('../models/Application');
const EnterpriseProfileUpdateRequest = require('../models/EnterpriseProfileUpdateRequest');
const AppError = require('../utils/AppError');
const { sanitizeUser } = require('../utils/serializers');
const { logAction } = require('./auditLogService');

const getDashboardStatistics = async () => {
  const [
    totalUsers,
    totalJobSeekers,
    totalEnterprises,
    totalJobs,
    pendingJobs,
    totalApplications,
    pendingReports,
    pendingEnterpriseRequests,
    totalTags,
  ] = await Promise.all([
    User.countDocuments(),
    User.countDocuments({ role: 'jobseeker' }),
    User.countDocuments({ role: 'enterprise' }),
    Job.countDocuments(),
    Job.countDocuments({ status: 'Processing' }),
    Application.countDocuments(),
    Report.countDocuments({ status: 'pending' }),
    EnterpriseProfileUpdateRequest.countDocuments({ status: 'pending' }),
    Tag.countDocuments(),
  ]);

  return {
    totalUsers,
    totalJobSeekers,
    totalEnterprises,
    totalJobs,
    pendingJobs,
    totalApplications,
    pendingReports,
    pendingEnterpriseRequests,
    totalTags,
  };
};

const listUsers = async () => {
  const users = await User.find().sort({ createdAt: -1 });
  return users.map(sanitizeUser);
};

const getUserById = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError('User not found', 404);
  }
  return sanitizeUser(user);
};

const banUser = async (userId, admin) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError('User not found', 404);
  }

  user.isBanned = true;
  await user.save();

  await logAction({
    actorId: admin._id,
    actorRole: admin.role,
    action: 'USER_BANNED',
    targetType: 'User',
    targetId: user._id,
  });

  return sanitizeUser(user);
};

const unbanUser = async (userId, admin) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError('User not found', 404);
  }

  user.isBanned = false;
  await user.save();

  await logAction({
    actorId: admin._id,
    actorRole: admin.role,
    action: 'USER_UNBANNED',
    targetType: 'User',
    targetId: user._id,
  });

  return sanitizeUser(user);
};

const deleteUser = async (userId, admin) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError('User not found', 404);
  }

  user.isActive = false;
  user.deletedAt = new Date();
  await user.save();

  await logAction({
    actorId: admin._id,
    actorRole: admin.role,
    action: 'USER_DEACTIVATED',
    targetType: 'User',
    targetId: user._id,
  });

  return { message: 'User deactivated successfully' };
};

const listEnterpriseUpdateRequests = async () =>
  EnterpriseProfileUpdateRequest.find().sort({ createdAt: -1 }).populate('enterpriseId', 'fullName email');

module.exports = {
  getDashboardStatistics,
  listUsers,
  getUserById,
  banUser,
  unbanUser,
  deleteUser,
  listEnterpriseUpdateRequests,
};
