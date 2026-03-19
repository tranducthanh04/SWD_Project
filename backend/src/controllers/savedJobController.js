const { successResponse } = require('../utils/apiResponse');
const catchAsync = require('../utils/catchAsync');
const savedJobService = require('../services/savedJobService');

const saveJob = catchAsync(async (req, res) => {
  const data = await savedJobService.saveJob(req.user._id, req.params.jobId);
  successResponse(res, { statusCode: 201, message: 'Job saved successfully', data });
});

const listSavedJobs = catchAsync(async (req, res) => {
  const data = await savedJobService.listSavedJobs(req.user._id);
  successResponse(res, { data });
});

const removeSavedJob = catchAsync(async (req, res) => {
  const data = await savedJobService.removeSavedJob(req.user._id, req.params.jobId);
  successResponse(res, { message: data.message });
});

module.exports = {
  saveJob,
  listSavedJobs,
  removeSavedJob,
};
