const Report = require('../models/Report');
const Job = require('../models/Job');
const User = require('../models/User');
const AppError = require('../utils/AppError');
const { logAction } = require('./auditLogService');

const createReport = async (reporter, payload) => {
  const job = await Job.findById(payload.jobId);
  if (!job) {
    throw new AppError('Không tìm thấy tin tuyển dụng', 404);
  }

  const existing = await Report.findOne({ reporterId: reporter._id, jobId: payload.jobId });
  if (existing) {
    throw new AppError('Bạn đã báo cáo tin tuyển dụng này trước đó', 409);
  }

  const report = await Report.create({
    reporterId: reporter._id,
    jobId: payload.jobId,
    title: payload.title,
    content: payload.content,
    status: 'pending',
  });

  await logAction({
    actorId: reporter._id,
    actorRole: reporter.role,
    action: 'JOB_REPORTED',
    targetType: 'Report',
    targetId: report._id,
    metadata: { jobId: payload.jobId },
  });

  return report;
};

const listReports = async () => {
  const reports = await Report.find().sort({ createdAt: -1 });
  return Promise.all(
    reports.map(async (report) => {
      const [reporter, job] = await Promise.all([
        User.findById(report.reporterId),
        Job.findById(report.jobId),
      ]);

      return {
        ...report.toObject(),
        reporter: reporter
          ? {
              _id: reporter._id,
              fullName: reporter.fullName,
              email: reporter.email,
            }
          : null,
        job,
      };
    }),
  );
};

const getReportById = async (reportId) => {
  const report = await Report.findById(reportId);
  if (!report) {
    throw new AppError('Không tìm thấy báo cáo', 404);
  }

  const [reporter, job] = await Promise.all([
    User.findById(report.reporterId),
    Job.findById(report.jobId),
  ]);

  return {
    ...report.toObject(),
    reporter: reporter
      ? {
          _id: reporter._id,
          fullName: reporter.fullName,
          email: reporter.email,
        }
      : null,
    job,
  };
};

module.exports = {
  createReport,
  listReports,
  getReportById,
};
