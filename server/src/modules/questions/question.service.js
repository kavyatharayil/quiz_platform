const questionRepository = require('./question.repository');
const ApiError = require('../../utils/ApiError');
const quizService = require('../quizzes/quiz.service'); // Need to ensure quiz exists

const createQuestion = async (quizId, questionBody) => {
  await quizService.getQuizById(quizId); // Throws if not found
  return questionRepository.createQuestion({ ...questionBody, quizId });
};

const getQuestionsByQuizId = async (quizId, userRole) => {
  await quizService.getQuizById(quizId); // Throws if not found
  const questions = await questionRepository.getQuestionsByQuizId(quizId);
  
  if (userRole === 'ADMIN') {
    return questions;
  }

  // Remove correctAnswer for non-admins
  return questions.map(q => {
    const qObj = q.toObject();
    delete qObj.correctAnswer;
    return qObj;
  });
};

const getQuestionById = async (questionId) => {
  const question = await questionRepository.getQuestionById(questionId);
  if (!question) {
    throw new ApiError(404, 'Question not found');
  }
  return question;
};

const updateQuestionById = async (questionId, updateBody) => {
  const question = await getQuestionById(questionId);
  return questionRepository.updateQuestionById(questionId, updateBody);
};

const deleteQuestionById = async (questionId) => {
  const question = await getQuestionById(questionId);
  await questionRepository.deleteQuestionById(questionId);
  return question;
};

module.exports = {
  createQuestion,
  getQuestionsByQuizId,
  getQuestionById,
  updateQuestionById,
  deleteQuestionById,
};
