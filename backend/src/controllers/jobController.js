const { successResponse } = require('../utils/apiResponse');
const catchAsync = require('../utils/catchAsync');
const jobService = require('../services/jobService');

const listJobs = catchAsync(async (req, res) => {
  const data = await jobService.listJobs(req.query, req.user || null);
  successResponse(res, { data: data.items, meta: data.meta });
});

const getJobById = catchAsync(async (req, res) => {
  const data = await jobService.getJobById(req.params.id, req.user || null);
  successResponse(res, { data });
});

const createJob = catchAsync(async (req, res) => {
  const data = await jobService.createJob(req.user, req.body);
  successResponse(res, { statusCode: 201, message: 'Job created and sent for review', data });
});

const updateJob = catchAsync(async (req, res) => {
  const data = await jobService.updateJob(req.params.id, req.user, req.body);
  successResponse(res, { message: 'Job updated and sent for review', data });
});

const deleteJob = catchAsync(async (req, res) => {
  const data = await jobService.deleteJob(req.params.id, req.user);
  successResponse(res, { message: data.message });
});

const listMyJobs = catchAsync(async (req, res) => {
  const data = await jobService.listEnterpriseJobs(req.user._id);
  successResponse(res, { data });
});

const closeJob = catchAsync(async (req, res) => {
  const data = await jobService.closeJob(req.params.id, req.user);
  successResponse(res, { message: 'Job closed successfully', data });
});

const listPendingJobs = catchAsync(async (_req, res) => {
  const data = await jobService.listPendingJobs();
  successResponse(res, { data });
});

const approveJob = catchAsync(async (req, res) => {
  const data = await jobService.approveJob(req.params.id, req.user, req.body.note);
  successResponse(res, { message: 'Job approved successfully', data });
});

const rejectJob = catchAsync(async (req, res) => {
  const data = await jobService.rejectJob(req.params.id, req.user, req.body.note);
  successResponse(res, { message: 'Job rejected successfully', data });
});

module.exports = {
  listJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
  listMyJobs,
  closeJob,
  listPendingJobs,
  approveJob,
  rejectJob,
};
