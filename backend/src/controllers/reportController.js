const { successResponse } = require('../utils/apiResponse');
const catchAsync = require('../utils/catchAsync');
const reportService = require('../services/reportService');

const createReport = catchAsync(async (req, res) => {
  const data = await reportService.createReport(req.user, req.body);
  successResponse(res, { statusCode: 201, message: 'Report submitted successfully', data });
});

const listReports = catchAsync(async (_req, res) => {
  const data = await reportService.listReports();
  successResponse(res, { data });
});

const getReportById = catchAsync(async (req, res) => {
  const data = await reportService.getReportById(req.params.id);
  successResponse(res, { data });
});

module.exports = {
  createReport,
  listReports,
  getReportById,
};
