const JOB_STATUSES = {
  PROCESSING: 'Processing',
  PUBLISHED: 'Published',
  REJECTED: 'Rejected',
  CLOSED: 'Closed',
  DELETED: 'Deleted',
};

const JOB_TYPES = ['Full-time', 'Part-time', 'Internship', 'Contract', 'Remote', 'Hybrid'];
const EXPERIENCE_LEVELS = ['Entry', 'Junior', 'Mid', 'Senior', 'Lead'];

module.exports = {
  JOB_STATUSES,
  JOB_STATUS_VALUES: Object.values(JOB_STATUSES),
  JOB_TYPES,
  EXPERIENCE_LEVELS,
};
