const Question = require('../../DB/model/question.model');

const createQuestion = async (questionBody) => {
  return Question.create(questionBody);
};

const getQuestionsByQuizId = async (quizId) => {
  return Question.find({ quizId });
};

const getQuestionById = async (id) => {
  return Question.findById(id);
};

const updateQuestionById = async (id, updateBody) => {
  return Question.findByIdAndUpdate(id, updateBody, { returnDocument: "after", runValidators: true });
};

const deleteQuestionById = async (id) => {
  return Question.findByIdAndDelete(id);
};

module.exports = {
  createQuestion,
  getQuestionsByQuizId,
  getQuestionById,
  updateQuestionById,
  deleteQuestionById,
};
