import api, { unwrap } from './client';

export const reportsApi = {
  create: (payload) => unwrap(api.post('/reports', payload)),
};
