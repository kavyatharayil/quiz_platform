const asyncHandler = require('../../utils/asyncHandler');
const resultService = require('./result.service');
const ApiResponse = require('../../utils/ApiResponse');
const ApiError = require('../../utils/ApiError');

const startQuiz = asyncHandler(async (req, res) => {
  const data = await resultService.startQuiz(req.user.id, req.params.id);
  res.status(201).send(new ApiResponse(201, 'Quiz started successfully', data));
});

const submitQuiz = asyncHandler(async (req, res) => {
  const { attemptId, answers } = req.body;
  const result = await resultService.submitQuiz(req.user.id, req.params.id, attemptId, answers);
  res.send(new ApiResponse(200, 'Quiz submitted successfully', result));
});

const getUserResults = asyncHandler(async (req, res) => {
  // If admin, they can view any user's results. If user, they can only view their own.
  if (req.user.role !== 'ADMIN' && req.user.id !== req.params.id) {
    throw new ApiError(403, 'Forbidden');
  }
  const { page, limit } = req.query;
  const options = { page: parseInt(page) || 1, limit: parseInt(limit) || 10 };
  const result = await resultService.getUserResults(req.params.id, options);
  res.send(new ApiResponse(200, 'Results retrieved successfully', result));
});

const getResult = asyncHandler(async (req, res) => {
  const result = await resultService.getResultById(req.params.id, req.user.id, req.user.role);
  res.send(new ApiResponse(200, 'Result retrieved successfully', result));
});

const getAllResults = asyncHandler(async (req, res) => {
  const { page, limit } = req.query;
  const options = { page: parseInt(page) || 1, limit: parseInt(limit) || 10 };
  const result = await resultService.getAllResults(options);
  res.send(new ApiResponse(200, 'All results retrieved successfully', result));
});

module.exports = {
  startQuiz,
  submitQuiz,
  getUserResults,
  getResult,
  getAllResults,
};
