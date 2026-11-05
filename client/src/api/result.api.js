import apiClient from "./apiClient";

export const resultApi = {
  // Admin only
  getAllResults: async (page = 1, limit = 10) => {
    const response = await apiClient.get(`/results?page=${page}&limit=${limit}`);
    return response.data.data;
  },

  // User routes
  startQuiz: async (quizId) => {
    const response = await apiClient.post(`/results/${quizId}/start`);
    return response.data.data;
  },
  
  submitQuiz: async (quizId, attemptId, answers) => {
    const response = await apiClient.post(`/results/${quizId}/submit`, { attemptId, answers });
    return response.data.data;
  },

  getUserResults: async (userId, page = 1, limit = 10) => {
    const response = await apiClient.get(`/users/${userId}/results?page=${page}&limit=${limit}`);
    return response.data.data;
  },

  getResult: async (resultId) => {
    const response = await apiClient.get(`/results/${resultId}`);
    return response.data.data;
  },
};
