import { roleLabels } from './constants';

export const currency = (min, max, unit = 'USD') => `${unit} ${Number(min).toLocaleString()} - ${Number(max).toLocaleString()}`;

export const dateDisplay = (value) =>
  value
    ? new Intl.DateTimeFormat('vi-VN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      }).format(new Date(value))
    : '-';

export const statusTone = (status = '') => {
  const normalized = status.toLowerCase();

  if (
    normalized.includes('published') ||
    normalized.includes('verified') ||
    normalized.includes('pass') ||
    normalized.includes('offered') ||
    normalized.includes('resolved') ||
    normalized.includes('active')
  ) {
    return 'success';
  }

  if (normalized.includes('processing') || normalized.includes('pending') || normalized.includes('interview')) {
    return 'warning';
  }

  if (
    normalized.includes('rejected') ||
    normalized.includes('fail') ||
    normalized.includes('banned') ||
    normalized.includes('deleted') ||
    normalized.includes('closed') ||
    normalized.includes('withdrawn') ||
    normalized.includes('inactive')
  ) {
    return 'danger';
  }

  return 'neutral';
};

export const displayStatus = (status = '') => {
  const map = {
    Published: 'Đang tuyển',
    Processing: 'Đang xử lý',
    Rejected: 'Từ chối',
    Closed: 'Đã đóng',
    Deleted: 'Đã xóa',
    Applied: 'Đã ứng tuyển',
    'Processing CV Round': 'Đang xử lý vòng CV',
    'Pass CV Round': 'Đạt vòng CV',
    'Fail CV Round': 'Không đạt vòng CV',
    'Interview Scheduled': 'Đã lên lịch phỏng vấn',
    'Pass Interview': 'Đạt phỏng vấn',
    'Fail Interview': 'Không đạt phỏng vấn',
    Offered: 'Đã nhận đề nghị',
    Withdrawn: 'Đã rút đơn',
    Verified: 'Đã xác minh',
    Unverified: 'Chưa xác minh',
    Active: 'Đang hoạt động',
    Inactive: 'Ngừng hoạt động',
    Banned: 'Bị khóa',
    pending: 'Chờ xử lý',
    reviewed: 'Đã xem xét',
    dismissed: 'Bác bỏ',
    resolved: 'Đã xử lý',
    approved: 'Đã duyệt',
    rejected: 'Từ chối',
    verified: 'Đã xác minh',
    pending_review: 'Chờ duyệt',
  };

  return map[status] || status;
};

export const displayRole = (role) => roleLabels[role] || role;

export const displayJobType = (jobType = '') => {
  const map = {
    'Full-time': 'Toàn thời gian',
    'Part-time': 'Bán thời gian',
    Internship: 'Thực tập',
    Contract: 'Hợp đồng',
    Remote: 'Từ xa',
    Hybrid: 'Linh hoạt',
  };

  return map[jobType] || jobType;
};

export const displayExperienceLevel = (level = '') => {
  const map = {
    Entry: 'Mới bắt đầu',
    Junior: 'Nhân viên',
    Mid: 'Trung cấp',
    Senior: 'Cao cấp',
    Lead: 'Trưởng nhóm',
  };

  return map[level] || level;
};

export const displayAccountPlan = (plan = '') => {
  const map = {
    free: 'Miễn phí',
    premium: 'Cao cấp',
  };

  return map[plan] || plan;
};

export const displayStatKey = (key) => {
  const map = {
    totalUsers: 'Tổng người dùng',
    totalJobSeekers: 'Tổng ứng viên',
    totalEnterprises: 'Tổng doanh nghiệp',
    totalJobs: 'Tổng tin tuyển dụng',
    pendingJobs: 'Tin chờ duyệt',
    totalApplications: 'Tổng đơn ứng tuyển',
    pendingReports: 'Báo cáo chờ xử lý',
    pendingEnterpriseRequests: 'Yêu cầu doanh nghiệp chờ duyệt',
    totalTags: 'Tổng thẻ',
  };

  return map[key] || key;
};

export const getErrorMessage = (error, fallback = 'Thao tác thất bại') => error?.response?.data?.message || fallback;