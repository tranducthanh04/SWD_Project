const Application = require('../models/Application');
const Job = require('../models/Job');
const JobSeekerProfile = require('../models/JobSeekerProfile');
const User = require('../models/User');
const AppError = require('../utils/AppError');
const { buildFileUrl } = require('../utils/fileStorage');
const { businessDaysBetween } = require('../utils/date');
const { logAction } = require('./auditLogService');

const enrichApplications = async (applications) =>
  Promise.all(
    applications.map(async (application) => {
      const item = application.toObject ? application.toObject() : { ...application };
      const [job, jobSeeker] = await Promise.all([
        Job.findById(item.jobId),
        User.findById(item.jobSeekerId),
      ]);

      return {
        ...item,
        job,
        jobSeeker: jobSeeker
          ? {
              _id: jobSeeker._id,
              fullName: jobSeeker.fullName,
              email: jobSeeker.email,
              avatar: jobSeeker.avatar,
            }
          : null,
        responseSla: {
          businessDaysElapsed: businessDaysBetween(item.appliedAt),
          targetDays: 5,
        },
      };
    }),
  );

const applyForJob = async (jobSeekerUser, jobId, payload, file) => {
  const [job, profile, existingApplication] = await Promise.all([
    Job.findById(jobId),
    JobSeekerProfile.findOne({ userId: jobSeekerUser._id }),
    Application.findOne({ jobId, jobSeekerId: jobSeekerUser._id }),
  ]);

  if (!job) {
    throw new AppError('Job not found', 404);
  }

  if (job.status !== 'Published' || job.isExpired || new Date(job.applicationDeadline) < new Date()) {
    throw new AppError('This job is closed or expired', 400);
  }

  if (!profile || !profile.profileCompleted) {
    throw new AppError('Please complete your profile before applying', 400);
  }

  if (existingApplication) {
    throw new AppError('You cannot reapply to a job once you have already applied or withdrawn', 409);
  }

  const cvFileUrl = file ? buildFileUrl('cvs', file.filename) : profile.cvFileUrl;
  if (!cvFileUrl) {
    throw new AppError('CV is required to apply', 400);
  }

  const application = await Application.create({
    jobId: job._id,
    enterpriseId: job.enterpriseId,
    jobSeekerId: jobSeekerUser._id,
    cvFileUrl,
    coverLetter: payload.coverLetter || '',
    status: 'Processing CV Round',
    history: [
      {
        status: 'Processing CV Round',
        changedBy: jobSeekerUser._id,
        changedAt: new Date(),
        note: 'Application submitted',
      },
    ],
  });

  job.applicantCount += 1;
  await job.save();

  await logAction({
    actorId: jobSeekerUser._id,
    actorRole: jobSeekerUser.role,
    action: 'JOB_APPLIED',
    targetType: 'Application',
    targetId: application._id,
    metadata: { jobId: job._id },
  });

  const [result] = await enrichApplications([application]);
  return result;
};

const getMyApplications = async (jobSeekerId) => {
  const applications = await Application.find({ jobSeekerId }).sort({ createdAt: -1 });
  return enrichApplications(applications);
};

const getMyApplicationDetail = async (jobSeekerId, applicationId) => {
  const application = await Application.findOne({ _id: applicationId, jobSeekerId });
  if (!application) {
    throw new AppError('Application not found', 404);
  }

  const [result] = await enrichApplications([application]);
  return result;
};

const withdrawApplication = async (jobSeekerId, applicationId) => {
  const application = await Application.findOne({ _id: applicationId, jobSeekerId });
  if (!application) {
    throw new AppError('Application not found', 404);
  }

  if (application.isWithdrawn) {
    throw new AppError('Application already withdrawn', 400);
  }

  application.status = 'Withdrawn';
  application.isWithdrawn = true;
  application.withdrawnAt = new Date();
  application.history.push({
    status: 'Withdrawn',
    changedBy: jobSeekerId,
    changedAt: new Date(),
    note: 'Withdrawn by candidate',
  });
  await application.save();

  await logAction({
    actorId: jobSeekerId,
    actorRole: 'jobseeker',
    action: 'APPLICATION_WITHDRAWN',
    targetType: 'Application',
    targetId: application._id,
  });

  const [result] = await enrichApplications([application]);
  return result;
};

const getEnterpriseApplications = async (enterpriseId, filters = {}) => {
  const query = { enterpriseId };
  if (filters.status) query.status = filters.status;
  if (filters.jobId) query.jobId = filters.jobId;

  const applications = await Application.find(query).sort({ createdAt: -1 });
  return enrichApplications(applications);
};

const getApplicantsByJob = async (enterpriseId, jobId) => {
  const job = await Job.findOne({ _id: jobId, enterpriseId });
  if (!job) {
    throw new AppError('Job not found', 404);
  }

  const applications = await Application.find({ jobId }).sort({ createdAt: -1 });
  return enrichApplications(applications);
};

const updateApplicationStatus = async (enterpriseId, applicationId, payload) => {
  const application = await Application.findById(applicationId);

  if (!application) {
    throw new AppError('Application not found', 404);
  }

  if (application.enterpriseId.toString() !== enterpriseId.toString()) {
    throw new AppError('You can only manage applications for your own jobs', 403);
  }

  if (payload.status === 'Withdrawn') {
    throw new AppError('Only job seekers can withdraw applications', 400);
  }

  application.status = payload.status;
  application.history.push({
    status: payload.status,
    changedBy: enterpriseId,
    changedAt: new Date(),
    note: payload.note || '',
  });
  await application.save();

  await logAction({
    actorId: enterpriseId,
    actorRole: 'enterprise',
    action: 'APPLICATION_STATUS_UPDATED',
    targetType: 'Application',
    targetId: application._id,
    metadata: { status: payload.status, note: payload.note || '' },
  });

  const [result] = await enrichApplications([application]);
  return result;
};

module.exports = {
  applyForJob,
  getMyApplications,
  getMyApplicationDetail,
  withdrawApplication,
  getEnterpriseApplications,
  getApplicantsByJob,
  updateApplicationStatus,
};
