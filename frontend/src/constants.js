export const roleLabels = {
  guest: 'Khách',
  jobseeker: 'Ứng viên',
  enterprise: 'Doanh nghiệp',
  admin: 'Quản trị viên',
};

export const applicationStatuses = [
  'Applied',
  'Processing CV Round',
  'Pass CV Round',
  'Fail CV Round',
  'Interview Scheduled',
  'Pass Interview',
  'Fail Interview',
  'Offered',
  'Rejected',
  'Withdrawn',
];

export const jobTypes = ['Full-time', 'Part-time', 'Internship', 'Contract', 'Remote', 'Hybrid'];
export const experienceLevels = ['Entry', 'Junior', 'Mid', 'Senior', 'Lead'];

export const getDashboardPath = (role) => {
  if (role === 'enterprise') return '/enterprise';
  if (role === 'admin') return '/admin';
  return '/dashboard';
};