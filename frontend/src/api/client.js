import axios from 'axios';
import { authStorage } from '../storage';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
});

const refreshClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
});

api.interceptors.request.use((config) => {
  const token = authStorage.getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const refreshToken = authStorage.getRefreshToken();

    if (error.response?.status === 401 && refreshToken && !originalRequest?._retry) {
      originalRequest._retry = true;
      try {
        const refreshResponse = await refreshClient.post('/auth/refresh-token', { refreshToken });
        authStorage.setSession(refreshResponse.data.data);
        originalRequest.headers.Authorization = `Bearer ${refreshResponse.data.data.accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        authStorage.clear();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

export const unwrap = async (promise) => {
  const response = await promise;
  return response.data;
};

export default api;
