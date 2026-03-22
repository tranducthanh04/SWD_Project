import api, { unwrap } from './client';

export const profileApi = {
  me: () => unwrap(api.get('/profile/me')),
  updateJobSeeker: (formData) =>
    unwrap(
      api.put('/profile/jobseeker', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      }),
    ),
  requestEnterpriseUpdate: (formData) =>
    unwrap(
      api.put('/profile/enterprise/request-update', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      }),
    ),
  enterpriseRequestStatus: () => unwrap(api.get('/profile/enterprise/request-status')),
};
