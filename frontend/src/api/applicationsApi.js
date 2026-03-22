import api, { unwrap } from './client';

export const applicationsApi = {
  apply: (jobId, formData) =>
    unwrap(
      api.post(`/applications/${jobId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      }),
    ),
  mine: () => unwrap(api.get('/applications/my')),
  detail: (id) => unwrap(api.get(`/applications/my/${id}`)),
  withdraw: (id) => unwrap(api.patch(`/applications/${id}/withdraw`)),
  enterpriseList: (params) => unwrap(api.get('/enterprise/applications', { params })),
  byJob: (jobId) => unwrap(api.get(`/enterprise/jobs/${jobId}/applications`)),
  updateStatus: (id, payload) => unwrap(api.patch(`/enterprise/applications/${id}/status`, payload)),
};
