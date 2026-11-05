const asyncHandler = require('../../utils/asyncHandler');
const questionService = require('./question.service');
const ApiResponse = require('../../utils/ApiResponse');

const createQuestion = asyncHandler(async (req, res) => {
  const question = await questionService.createQuestion(req.params.quizId, req.body);
  res.status(201).send(new ApiResponse(201, 'Question created successfully', question));
});

const getQuestions = asyncHandler(async (req, res) => {
  const questions = await questionService.getQuestionsByQuizId(req.params.quizId, req.user.role);
  res.send(new ApiResponse(200, 'Questions retrieved successfully', questions));
});

const updateQuestion = asyncHandler(async (req, res) => {
  const question = await questionService.updateQuestionById(req.params.id, req.body);
  res.send(new ApiResponse(200, 'Question updated successfully', question));
});

const deleteQuestion = asyncHandler(async (req, res) => {
  await questionService.deleteQuestionById(req.params.id);
  res.status(204).send();
});

module.exports = {
  createQuestion,
  getQuestions,
  updateQuestion,
  deleteQuestion,
};
