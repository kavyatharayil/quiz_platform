const asyncHandler = require('../../utils/asyncHandler');
const ApiResponse = require('../../utils/ApiResponse');
const Quiz = require('../../DB/model/quiz.model');
const Question = require('../../DB/model/question.model');
const Category = require('../../DB/model/category.model');
const User = require('../../DB/model/user.model');
const Result = require('../../DB/model/result.model');

const getDashboardStats = asyncHandler(async (req, res) => {
  const [quizzes, questions, categories, users, results, recentActivities] = await Promise.all([
    Quiz.countDocuments(),
    Question.countDocuments(),
    Category.countDocuments(),
    User.countDocuments(),
    Result.countDocuments(),
    Result.find().sort({ createdAt: -1 }).limit(10).populate('userId', 'name').populate('quizId', 'title'),
  ]);

  const stats = {
    totalQuizzes: quizzes,
    totalQuestions: questions,
    categories: categories,
    registeredUsers: users,
    quizAttempts: results,
    recentActivities: recentActivities.map(act => ({
      id: act._id,
      user: act.userId?.name || 'Unknown',
      action: `Completed '${act.quizId?.title || 'Unknown Quiz'}'`,
      score: act.percentage != null ? `${Math.round(act.percentage)}%` : '-',
      date: new Date(act.createdAt).toLocaleString(),
    })),
  };

  res.send(new ApiResponse(200, 'Dashboard stats retrieved successfully', stats));
});

module.exports = {
  getDashboardStats,
};
