import api, { unwrap } from './client';

export const savedJobsApi = {
  save: (jobId) => unwrap(api.post(`/saved-jobs/${jobId}`)),
  list: () => unwrap(api.get('/saved-jobs')),
  remove: (jobId) => unwrap(api.delete(`/saved-jobs/${jobId}`)),
};
