import apiClient from './apiClient';

export const quizApi = {
  getQuizzes: async (params) => {
    const response = await apiClient.get('/quizzes', { params });
    return response.data.data;
  },
  getQuizById: async (id) => {
    const response = await apiClient.get(`/quizzes/${id}`);
    return response.data.data;
  },
  startQuiz: async (id) => {
    const response = await apiClient.post(`/quizzes/${id}/start`);
    return response.data.data;
  },
  submitQuiz: async (id, attemptId, answers) => {
    const response = await apiClient.post(`/quizzes/${id}/submit`, { attemptId, answers });
    return response.data.data;
  },
  // Admin Endpoints
  createQuiz: async (quizData) => {
    const response = await apiClient.post('/quizzes', quizData);
    return response.data.data;
  },
  updateQuiz: async (id, quizData) => {
    const response = await apiClient.put(`/quizzes/${id}`, quizData);
    return response.data.data;
  },
  deleteQuiz: async (id) => {
    const response = await apiClient.delete(`/quizzes/${id}`);
    return response.data.data;
  }
};
