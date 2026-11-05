import apiClient from './apiClient';

export const authApi = {
  login: async (email, password) => {
    const response = await apiClient.post('/auth/login', { email, password });
    return response.data.data;
  },
  register: async (name, email, password) => {
    const response = await apiClient.post('/auth/register', { name, email, password });
    return response.data.data;
  },
  logout: async () => {
    const response = await apiClient.post('/auth/logout');
    return response.data.data;
  }
};
