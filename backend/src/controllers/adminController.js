const { successResponse } = require('../utils/apiResponse');
const catchAsync = require('../utils/catchAsync');
const adminService = require('../services/adminService');
const profileService = require('../services/profileService');

const getDashboard = catchAsync(async (_req, res) => {
  const data = await adminService.getDashboardStatistics();
  successResponse(res, { data });
});

const listUsers = catchAsync(async (_req, res) => {
  const data = await adminService.listUsers();
  successResponse(res, { data });
});

const getUserById = catchAsync(async (req, res) => {
  const data = await adminService.getUserById(req.params.id);
  successResponse(res, { data });
});

const banUser = catchAsync(async (req, res) => {
  const data = await adminService.banUser(req.params.id, req.user);
  successResponse(res, { message: 'User banned successfully', data });
});

const unbanUser = catchAsync(async (req, res) => {
  const data = await adminService.unbanUser(req.params.id, req.user);
  successResponse(res, { message: 'User unbanned successfully', data });
});

const deleteUser = catchAsync(async (req, res) => {
  const data = await adminService.deleteUser(req.params.id, req.user);
  successResponse(res, { message: data.message });
});

const listEnterpriseUpdateRequests = catchAsync(async (_req, res) => {
  const data = await adminService.listEnterpriseUpdateRequests();
  successResponse(res, { data });
});

const approveEnterpriseUpdateRequest = catchAsync(async (req, res) => {
  const data = await profileService.approveEnterpriseProfileUpdateRequest(req.params.id, req.user._id, req.body.note);
  successResponse(res, { message: 'Enterprise profile update approved', data });
});

const rejectEnterpriseUpdateRequest = catchAsync(async (req, res) => {
  const data = await profileService.rejectEnterpriseProfileUpdateRequest(req.params.id, req.user._id, req.body.note);
  successResponse(res, { message: 'Enterprise profile update rejected', data });
});

module.exports = {
  getDashboard,
  listUsers,
  getUserById,
  banUser,
  unbanUser,
  deleteUser,
  listEnterpriseUpdateRequests,
  approveEnterpriseUpdateRequest,
  rejectEnterpriseUpdateRequest,
};
