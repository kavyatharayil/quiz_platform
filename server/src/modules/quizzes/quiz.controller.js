const asyncHandler = require('../../utils/asyncHandler');
const quizService = require('./quiz.service');
const ApiResponse = require('../../utils/ApiResponse');

const createQuiz = asyncHandler(async (req, res) => {
  const quizBody = { ...req.body, createdBy: req.user.id };
  const quiz = await quizService.createQuiz(quizBody);
  res.status(201).send(new ApiResponse(201, 'Quiz created successfully', quiz));
});

const getQuizzes = asyncHandler(async (req, res) => {
  // Simple filter for published only if not admin, or all if admin
  const filter = req.user.role === 'ADMIN' ? {} : { isPublished: true };
  const { page, limit } = req.query;
  const options = { page: parseInt(page) || 1, limit: parseInt(limit) || 10 };
  const result = await quizService.getQuizzes(filter, options);
  res.send(new ApiResponse(200, 'Quizzes retrieved successfully', result));
});

const getQuiz = asyncHandler(async (req, res) => {
  const quiz = await quizService.getQuizById(req.params.id);
  res.send(new ApiResponse(200, 'Quiz retrieved successfully', quiz));
});

const updateQuiz = asyncHandler(async (req, res) => {
  const quiz = await quizService.updateQuizById(req.params.id, req.body);
  res.send(new ApiResponse(200, 'Quiz updated successfully', quiz));
});

const deleteQuiz = asyncHandler(async (req, res) => {
  await quizService.deleteQuizById(req.params.id);
  res.status(204).send();
});

module.exports = {
  createQuiz,
  getQuizzes,
  getQuiz,
  updateQuiz,
  deleteQuiz,
};
