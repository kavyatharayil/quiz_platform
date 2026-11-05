import apiClient from './apiClient';

export const questionApi = {
  getQuestionsByQuizId: async (quizId) => {
    const response = await apiClient.get(`/quizzes/${quizId}/questions`);
    return response.data.data;
  },
  // Admin Endpoints
  createQuestion: async (quizId, questionData) => {
    const response = await apiClient.post(`/quizzes/${quizId}/questions`, questionData);
    return response.data.data;
  },
  updateQuestion: async (id, questionData) => {
    const response = await apiClient.put(`/questions/${id}`, questionData);
    return response.data.data;
  },
  deleteQuestion: async (id) => {
    const response = await apiClient.delete(`/questions/${id}`);
    return response.data.data;
  }
};
