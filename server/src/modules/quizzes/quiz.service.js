const quizRepository = require('./quiz.repository');
const ApiError = require('../../utils/ApiError');

const createQuiz = async (quizBody) => {
  return quizRepository.createQuiz(quizBody);
};

const getQuizzes = async (filter, options) => {
  return quizRepository.getQuizzes(filter, options);
};

const getQuizById = async (quizId) => {
  const quiz = await quizRepository.getQuizById(quizId);
  if (!quiz) {
    throw new ApiError(404, 'Quiz not found');
  }
  return quiz;
};

const updateQuizById = async (quizId, updateBody) => {
  const quiz = await getQuizById(quizId);
  return quizRepository.updateQuizById(quizId, updateBody);
};

const deleteQuizById = async (quizId) => {
  const quiz = await getQuizById(quizId);
  await quizRepository.deleteQuizById(quizId);
  return quiz;
};

module.exports = {
  createQuiz,
  getQuizzes,
  getQuizById,
  updateQuizById,
  deleteQuizById,
};
