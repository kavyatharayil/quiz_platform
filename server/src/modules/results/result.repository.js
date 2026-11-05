const Result = require('../../DB/model/result.model');
const paginate = require('../../utils/pagination');

const createResult = async (resultBody) => {
  return Result.create(resultBody);
};

const getResultById = async (id) => {
  return Result.findById(id).populate('quizId', 'title description duration totalMarks');
};

const getResults = async (filter = {}, options = {}) => {
  const populate = [
    { path: 'quizId', select: 'title totalMarks' },
    { path: 'userId', select: 'name email' }
  ];
  const paginated = await paginate(Result, filter, { ...options, populate });

  return {
    results: paginated.results,
    page: paginated.page,
    limit: paginated.limit,
    totalPages: paginated.totalPages,
    totalResults: paginated.totalResults,
  };
};

const updateResultById = async (id, updateBody) => {
  return Result.findByIdAndUpdate(id, updateBody, { returnDocument: "after" });
};

const getActiveAttempt = async (userId, quizId) => {
  return Result.findOne({ userId, quizId, status: 'IN_PROGRESS' });
};

const getCompletedAttempts = async (userId, quizId) => {
  return Result.find({ userId, quizId, status: 'COMPLETED' }).sort({ submittedAt: 1 });
};

module.exports = {
  createResult,
  getResultById,
  getResults,
  updateResultById,
  getActiveAttempt,
  getCompletedAttempts,
};
