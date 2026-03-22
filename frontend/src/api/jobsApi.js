import api, { unwrap } from './client';

export const jobsApi = {
  list: (params) => unwrap(api.get('/jobs', { params })),
  detail: (id) => unwrap(api.get(`/jobs/${id}`)),
  create: (payload) => unwrap(api.post('/jobs', payload)),
  update: (id, payload) => unwrap(api.put(`/jobs/${id}`, payload)),
  remove: (id) => unwrap(api.delete(`/jobs/${id}`)),
  close: (id) => unwrap(api.patch(`/jobs/${id}/close`)),
  myJobs: () => unwrap(api.get('/enterprise/jobs/my')),
};
