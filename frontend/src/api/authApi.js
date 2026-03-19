import api, { unwrap } from './client';

export const authApi = {
  register: (payload) => unwrap(api.post('/auth/register', payload)),
  verifyEmail: (payload) => unwrap(api.post('/auth/verify-email', payload)),
  login: (payload) => unwrap(api.post('/auth/login', payload)),
  googleLogin: (payload) => unwrap(api.post('/auth/google-login', payload)),
  forgotPassword: (payload) => unwrap(api.post('/auth/forgot-password', payload)),
  resetPassword: (payload) => unwrap(api.post('/auth/reset-password', payload)),
  changePassword: (payload) => unwrap(api.post('/auth/change-password', payload)),
  logout: (refreshToken) => unwrap(api.post('/auth/logout', { refreshToken })),
  me: () => unwrap(api.get('/auth/me')),
};
