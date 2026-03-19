const Job = require('../models/Job');
const Tag = require('../models/Tag');
const SavedJob = require('../models/SavedJob');
const EnterpriseProfile = require('../models/EnterpriseProfile');
const JobSeekerProfile = require('../models/JobSeekerProfile');
const AppError = require('../utils/AppError');
const { JOB_STATUSES } = require('../constants/job');
const { parseArrayInput } = require('../utils/parsers');
const { logAction } = require('./auditLogService');

const syncExpiredJobs = async () => {
  await Job.updateMany(
    {
      isExpired: false,
      applicationDeadline: { $lt: new Date() },
      status: { $nin: [JOB_STATUSES.DELETED] },
    },
    { isExpired: true },
  );
};

const isOpenPublicJob = (job) =>
  job.status === JOB_STATUSES.PUBLISHED && !job.isExpired && new Date(job.applicationDeadline) >= new Date();

const enrichJobs = async (jobs) => {
  const tagIds = [...new Set(jobs.flatMap((job) => (job.tags || []).map((tag) => tag.toString())))];
  const enterpriseIds = [...new Set(jobs.map((job) => job.enterpriseId?.toString()).filter(Boolean))];

  const [tags, companies] = await Promise.all([
    Tag.find({ _id: { $in: tagIds } }),
    EnterpriseProfile.find({ userId: { $in: enterpriseIds } }),
  ]);

  const tagMap = new Map(tags.map((tag) => [tag._id.toString(), tag.toObject()]));
  const companyMap = new Map(companies.map((company) => [company.userId.toString(), company.toObject()]));

  return jobs.map((job) => {
    const value = job.toObject ? job.toObject() : { ...job };
    return {
      ...value,
      tags: (value.tags || []).map((tagId) => tagMap.get(tagId.toString())).filter(Boolean),
      company: companyMap.get(value.enterpriseId.toString()) || null,
      isOpen: isOpenPublicJob(value),
    };
  });
};

const scoreJob = (job, queryText, recommendedSignals = []) => {
  const haystack = [
    job.title,
    job.overview,
    job.description,
    (job.requirements || []).join(' '),
    job.company?.companyName,
    (job.tags || []).map((tag) => tag.name).join(' '),
  ]
    .join(' ')
    .toLowerCase();

  const tokens = queryText
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean);

  let score = 0;
  tokens.forEach((token) => {
    if (job.title?.toLowerCase().includes(token)) score += 5;
    if (haystack.includes(token)) score += 2;
  });

  if (recommendedSignals.length > 0) {
    const tagNames = (job.tags || []).map((tag) => `${tag.name}`.toLowerCase());
    recommendedSignals.forEach((signal) => {
      if (tagNames.includes(signal)) score += 3;
      if (haystack.includes(signal)) score += 1;
    });
  }

  return score;
};

const listJobs = async (params = {}, currentUser = null) => {
  await syncExpiredJobs();

  const {
    q = '',
    city,
    jobType,
    salaryMin,
    salaryMax,
    experienceLevel,
    tag,
    sort = 'relevance',
    page = 1,
    limit = 10,
    recommended = 'false',
  } = params;

  const query = {
    status: JOB_STATUSES.PUBLISHED,
    isExpired: false,
    applicationDeadline: { $gte: new Date() },
  };

  if (city) query.location = { $regex: city, $options: 'i' };
  if (jobType) query.jobType = jobType;
  if (experienceLevel) query.experienceLevel = experienceLevel;
  if (salaryMin) query.salaryMax = { ...(query.salaryMax || {}), $gte: Number(salaryMin) };
  if (salaryMax) query.salaryMin = { ...(query.salaryMin || {}), $lte: Number(salaryMax) };

  if (tag) {
    const tags = await Tag.find({
      $or: [{ name: { $regex: tag, $options: 'i' } }, { slug: { $regex: tag, $options: 'i' } }],
    });
    query.tags = { $in: tags.map((item) => item._id) };
  }

  let jobs = await Job.find(query).sort({ createdAt: -1 });
  let enriched = await enrichJobs(jobs);

  if (q) {
    const searchText = q.toLowerCase();
    enriched = enriched
      .map((job) => ({ ...job, relevanceScore: scoreJob(job, searchText) }))
      .filter((job) => job.relevanceScore > 0);
  }

  if (recommended === 'true' && currentUser?.role === 'jobseeker') {
    const [profile, savedJobs] = await Promise.all([
      JobSeekerProfile.findOne({ userId: currentUser._id }),
      SavedJob.find({ jobSeekerId: currentUser._id }),
    ]);

    const savedJobsDocs = savedJobs.length ? await Job.find({ _id: { $in: savedJobs.map((job) => job.jobId) } }) : [];
    const savedTagIds = savedJobsDocs.flatMap((job) => (job.tags || []).map((item) => item.toString()));
    const savedTags = savedTagIds.length ? await Tag.find({ _id: { $in: savedTagIds } }) : [];
    const recommendedSignals = [
      ...(profile?.favouriteTags || []).map((item) => item.toLowerCase()),
      ...savedTags.map((item) => item.name.toLowerCase()),
    ];

    enriched = enriched
      .map((job) => ({ ...job, recommendationScore: scoreJob(job, q || job.title, recommendedSignals) }))
      .sort((a, b) => b.recommendationScore - a.recommendationScore || new Date(b.createdAt) - new Date(a.createdAt));
  } else if (sort === 'latest' || !q) {
    enriched = enriched.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  } else {
    enriched = enriched.sort((a, b) => b.relevanceScore - a.relevanceScore || new Date(b.createdAt) - new Date(a.createdAt));
  }

  const numericPage = Number(page);
  const numericLimit = Number(limit);
  const start = (numericPage - 1) * numericLimit;
  const items = enriched.slice(start, start + numericLimit);

  return {
    items,
    meta: {
      total: enriched.length,
      page: numericPage,
      limit: numericLimit,
      totalPages: Math.ceil(enriched.length / numericLimit) || 1,
    },
  };
};

const getJobById = async (jobId, currentUser = null) => {
  await syncExpiredJobs();

  const job = await Job.findById(jobId);
  if (!job) {
    throw new AppError('Job not found', 404);
  }

  const [enrichedJob] = await enrichJobs([job]);
  const canViewPrivate =
    currentUser &&
    (currentUser.role === 'admin' || job.enterpriseId.toString() === currentUser._id.toString());

  if (!canViewPrivate && !isOpenPublicJob(job)) {
    throw new AppError('This job is not publicly available', 404);
  }

  if (!canViewPrivate) {
    job.viewCount += 1;
    await job.save();
    enrichedJob.viewCount = job.viewCount;
  }

  return enrichedJob;
};

const assertEnterpriseCanPost = async (enterpriseId) => {
  const profile = await EnterpriseProfile.findOne({ userId: enterpriseId });

  if (!profile) {
    throw new AppError('Enterprise profile not found', 404);
  }

  if (profile.verificationStatus !== 'verified') {
    throw new AppError('Only verified enterprises can post jobs', 403);
  }

  if (profile.accountPlan === 'free') {
    const activeJobCount = await Job.countDocuments({
      enterpriseId,
      status: { $in: [JOB_STATUSES.PROCESSING, JOB_STATUSES.PUBLISHED] },
      deletedAt: null,
    });

    if (activeJobCount >= 5) {
      throw new AppError('Free enterprise accounts can only keep up to 5 active jobs', 400);
    }
  }

  return profile;
};

const normalizeJobPayload = async (payload) => {
  const tagInput = parseArrayInput(payload.tags);
  const requirements = parseArrayInput(payload.requirements);
  const benefits = parseArrayInput(payload.benefits);

  const matchedTags = tagInput.length
    ? await Tag.find({
        $or: [{ _id: { $in: tagInput.filter((item) => /^[a-f\d]{24}$/i.test(item)) } }, { slug: { $in: tagInput } }, { name: { $in: tagInput } }],
      })
    : [];

  return {
    title: payload.title,
    overview: payload.overview,
    description: payload.description,
    requirements,
    benefits,
    location: payload.location,
    salaryMin: Number(payload.salaryMin),
    salaryMax: Number(payload.salaryMax),
    currency: payload.currency || 'USD',
    experienceLevel: payload.experienceLevel,
    jobType: payload.jobType,
    tags: matchedTags.map((item) => item._id),
    applicationDeadline: payload.applicationDeadline,
  };
};

const createJob = async (enterpriseUser, payload) => {
  await assertEnterpriseCanPost(enterpriseUser._id);
  const data = await normalizeJobPayload(payload);

  const job = await Job.create({
    enterpriseId: enterpriseUser._id,
    ...data,
    status: JOB_STATUSES.PROCESSING,
  });

  await logAction({
    actorId: enterpriseUser._id,
    actorRole: enterpriseUser.role,
    action: 'JOB_CREATED',
    targetType: 'Job',
    targetId: job._id,
    metadata: { title: job.title },
  });

  return getJobById(job._id, enterpriseUser);
};

const listEnterpriseJobs = async (enterpriseId) => {
  await syncExpiredJobs();
  const jobs = await Job.find({ enterpriseId }).sort({ createdAt: -1 });
  return enrichJobs(jobs);
};

const updateJob = async (jobId, enterpriseUser, payload) => {
  const job = await Job.findById(jobId);
  if (!job) {
    throw new AppError('Job not found', 404);
  }

  if (job.enterpriseId.toString() !== enterpriseUser._id.toString()) {
    throw new AppError('You can only update your own jobs', 403);
  }

  const data = await normalizeJobPayload(payload);
  Object.assign(job, data, {
    status: JOB_STATUSES.PROCESSING,
    adminReview: {},
    isExpired: false,
  });
  await job.save();

  await logAction({
    actorId: enterpriseUser._id,
    actorRole: enterpriseUser.role,
    action: 'JOB_UPDATED',
    targetType: 'Job',
    targetId: job._id,
    metadata: { title: job.title },
  });

  return getJobById(job._id, enterpriseUser);
};

const deleteJob = async (jobId, enterpriseUser) => {
  const job = await Job.findById(jobId);
  if (!job) {
    throw new AppError('Job not found', 404);
  }

  if (job.enterpriseId.toString() !== enterpriseUser._id.toString()) {
    throw new AppError('You can only delete your own jobs', 403);
  }

  job.status = JOB_STATUSES.DELETED;
  job.deletedAt = new Date();
  await job.save();

  await logAction({
    actorId: enterpriseUser._id,
    actorRole: enterpriseUser.role,
    action: 'JOB_DELETED',
    targetType: 'Job',
    targetId: job._id,
  });

  return { message: 'Job deleted successfully' };
};

const closeJob = async (jobId, enterpriseUser) => {
  const job = await Job.findById(jobId);
  if (!job) {
    throw new AppError('Job not found', 404);
  }

  if (job.enterpriseId.toString() !== enterpriseUser._id.toString()) {
    throw new AppError('You can only close your own jobs', 403);
  }

  job.status = JOB_STATUSES.CLOSED;
  await job.save();

  await logAction({
    actorId: enterpriseUser._id,
    actorRole: enterpriseUser.role,
    action: 'JOB_CLOSED',
    targetType: 'Job',
    targetId: job._id,
  });

  return getJobById(job._id, enterpriseUser);
};

const listPendingJobs = async () => {
  await syncExpiredJobs();
  const jobs = await Job.find({ status: JOB_STATUSES.PROCESSING }).sort({ createdAt: -1 });
  return enrichJobs(jobs);
};

const approveJob = async (jobId, adminUser, note = '') => {
  const job = await Job.findById(jobId);
  if (!job) {
    throw new AppError('Job not found', 404);
  }

  job.status = JOB_STATUSES.PUBLISHED;
  job.adminReview = {
    reviewedBy: adminUser._id,
    reviewedAt: new Date(),
    note,
  };
  await job.save();

  await logAction({
    actorId: adminUser._id,
    actorRole: adminUser.role,
    action: 'JOB_APPROVED',
    targetType: 'Job',
    targetId: job._id,
    metadata: { note },
  });

  return getJobById(job._id, adminUser);
};

const rejectJob = async (jobId, adminUser, note = '') => {
  const job = await Job.findById(jobId);
  if (!job) {
    throw new AppError('Job not found', 404);
  }

  job.status = JOB_STATUSES.REJECTED;
  job.adminReview = {
    reviewedBy: adminUser._id,
    reviewedAt: new Date(),
    note,
  };
  await job.save();

  await logAction({
    actorId: adminUser._id,
    actorRole: adminUser.role,
    action: 'JOB_REJECTED',
    targetType: 'Job',
    targetId: job._id,
    metadata: { note },
  });

  return getJobById(job._id, adminUser);
};

module.exports = {
  listJobs,
  getJobById,
  createJob,
  listEnterpriseJobs,
  updateJob,
  deleteJob,
  closeJob,
  listPendingJobs,
  approveJob,
  rejectJob,
  enrichJobs,
};
