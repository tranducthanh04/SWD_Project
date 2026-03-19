import api, { unwrap } from './client';

export const adminApi = {
  dashboard: () => unwrap(api.get('/admin/dashboard')),
  users: () => unwrap(api.get('/admin/users')),
  userDetail: (id) => unwrap(api.get(`/admin/users/${id}`)),
  banUser: (id) => unwrap(api.patch(`/admin/users/${id}/ban`)),
  unbanUser: (id) => unwrap(api.patch(`/admin/users/${id}/unban`)),
  deleteUser: (id) => unwrap(api.delete(`/admin/users/${id}`)),
  pendingJobs: () => unwrap(api.get('/admin/jobs/pending')),
  approveJob: (id, note) => unwrap(api.patch(`/admin/jobs/${id}/approve`, { note })),
  rejectJob: (id, note) => unwrap(api.patch(`/admin/jobs/${id}/reject`, { note })),
  enterpriseUpdateRequests: () => unwrap(api.get('/admin/enterprise-update-requests')),
  approveEnterpriseRequest: (id, note) => unwrap(api.patch(`/admin/enterprise-update-requests/${id}/approve`, { note })),
  rejectEnterpriseRequest: (id, note) => unwrap(api.patch(`/admin/enterprise-update-requests/${id}/reject`, { note })),
  reports: () => unwrap(api.get('/admin/reports')),
  reportDetail: (id) => unwrap(api.get(`/admin/reports/${id}`)),
};
