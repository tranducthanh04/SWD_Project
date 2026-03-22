import api, { unwrap } from './client';

export const tagsApi = {
  list: () => unwrap(api.get('/tags')),
  adminList: () => unwrap(api.get('/admin/tags')),
  create: (payload) => unwrap(api.post('/admin/tags', payload)),
  update: (id, payload) => unwrap(api.put(`/admin/tags/${id}`, payload)),
  remove: (id) => unwrap(api.delete(`/admin/tags/${id}`)),
};
