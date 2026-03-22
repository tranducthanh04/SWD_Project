const { successResponse } = require('../utils/apiResponse');
const catchAsync = require('../utils/catchAsync');
const applicationService = require('../services/applicationService');

const applyForJob = catchAsync(async (req, res) => {
  const data = await applicationService.applyForJob(req.user, req.params.jobId, req.body, req.file);
  successResponse(res, { statusCode: 201, message: 'Gửi đơn ứng tuyển thành công', data });
});

const listMyApplications = catchAsync(async (req, res) => {
  const data = await applicationService.getMyApplications(req.user._id);
  successResponse(res, { data });
});

const getMyApplicationDetail = catchAsync(async (req, res) => {
  const data = await applicationService.getMyApplicationDetail(req.user._id, req.params.id);
  successResponse(res, { data });
});

const withdrawApplication = catchAsync(async (req, res) => {
  const data = await applicationService.withdrawApplication(req.user._id, req.params.id);
  successResponse(res, { message: 'Rút đơn ứng tuyển thành công', data });
});

const getEnterpriseApplications = catchAsync(async (req, res) => {
  const data = await applicationService.getEnterpriseApplications(req.user._id, req.query);
  successResponse(res, { data });
});

const getApplicantsByJob = catchAsync(async (req, res) => {
  const data = await applicationService.getApplicantsByJob(req.user._id, req.params.jobId);
  successResponse(res, { data });
});

const updateApplicationStatus = catchAsync(async (req, res) => {
  const data = await applicationService.updateApplicationStatus(req.user._id, req.params.id, req.body);
  successResponse(res, { message: 'Cập nhật trạng thái đơn ứng tuyển thành công', data });
});

module.exports = {
  applyForJob,
  listMyApplications,
  getMyApplicationDetail,
  withdrawApplication,
  getEnterpriseApplications,
  getApplicantsByJob,
  updateApplicationStatus,
};
