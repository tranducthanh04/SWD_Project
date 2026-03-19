const Job = require('../models/Job');
const SavedJob = require('../models/SavedJob');
const Tag = require('../models/Tag');
const EnterpriseProfile = require('../models/EnterpriseProfile');
const AppError = require('../utils/AppError');

const hydrateSavedJobs = async (records) => {
  const tagIds = [];
  const enterpriseIds = [];

  records.forEach((record) => {
    if (record.jobId?.tags) {
      tagIds.push(...record.jobId.tags.map((tag) => tag.toString()));
    }
    if (record.jobId?.enterpriseId) {
      enterpriseIds.push(record.jobId.enterpriseId.toString());
    }
  });

  const [tags, profiles] = await Promise.all([
    Tag.find({ _id: { $in: [...new Set(tagIds)] } }),
    EnterpriseProfile.find({ userId: { $in: [...new Set(enterpriseIds)] } }),
  ]);

  const tagMap = new Map(tags.map((tag) => [tag._id.toString(), tag]));
  const profileMap = new Map(profiles.map((profile) => [profile.userId.toString(), profile]));

  return records.map((record) => ({
    ...record.toObject(),
    jobId: record.jobId
      ? {
          ...record.jobId.toObject(),
          tags: record.jobId.tags.map((tagId) => tagMap.get(tagId.toString())).filter(Boolean),
          company: profileMap.get(record.jobId.enterpriseId.toString()) || null,
        }
      : null,
  }));
};

const saveJob = async (jobSeekerId, jobId) => {
  const job = await Job.findById(jobId);
  if (!job || job.status !== 'Published' || job.isExpired || new Date(job.applicationDeadline) < new Date()) {
    throw new AppError('Only open published jobs can be saved', 400);
  }

  const existing = await SavedJob.findOne({ jobSeekerId, jobId });
  if (existing) {
    throw new AppError('This job is already saved', 409);
  }

  return SavedJob.create({ jobSeekerId, jobId });
};

const listSavedJobs = async (jobSeekerId) => {
  const records = await SavedJob.find({ jobSeekerId }).sort({ createdAt: -1 });
  const jobs = await Promise.all(
    records.map(async (record) => {
      const job = await Job.findById(record.jobId).lean();
      return { ...record.toObject(), jobId: job };
    }),
  );

  const mappedRecords = jobs.map((job) => ({
    toObject: () => job,
    jobId: {
      ...job.jobId,
      toObject: () => job.jobId,
      tags: job.jobId?.tags || [],
      enterpriseId: job.jobId?.enterpriseId,
    },
  }));

  return hydrateSavedJobs(mappedRecords);
};

const removeSavedJob = async (jobSeekerId, jobId) => {
  const deleted = await SavedJob.findOneAndDelete({ jobSeekerId, jobId });
  if (!deleted) {
    throw new AppError('Saved job not found', 404);
  }

  return { message: 'Saved job removed successfully' };
};

module.exports = {
  saveJob,
  listSavedJobs,
  removeSavedJob,
};
