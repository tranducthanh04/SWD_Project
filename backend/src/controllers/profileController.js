const { successResponse } = require('../utils/apiResponse');
const catchAsync = require('../utils/catchAsync');
const profileService = require('../services/profileService');

const getMyProfile = catchAsync(async (req, res) => {
  const data = await profileService.getMyProfile(req.user);
  successResponse(res, { data });
});

const updateJobSeekerProfile = catchAsync(async (req, res) => {
  const data = await profileService.updateJobSeekerProfile(req.user._id, req.body, req.files);
  successResponse(res, { message: 'Profile updated successfully', data });
});

const requestEnterpriseProfileUpdate = catchAsync(async (req, res) => {
  const data = await profileService.requestEnterpriseProfileUpdate(req.user._id, req.body, req.files);
  successResponse(res, { statusCode: 201, message: 'Enterprise profile update request submitted', data });
});

const getEnterpriseRequestStatus = catchAsync(async (req, res) => {
  const data = await profileService.getEnterpriseRequestStatus(req.user._id);
  successResponse(res, { data });
});

module.exports = {
  getMyProfile,
  updateJobSeekerProfile,
  requestEnterpriseProfileUpdate,
  getEnterpriseRequestStatus,
};
