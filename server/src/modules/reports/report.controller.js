const asyncHandler = require('../../utils/asyncHandler');
const ApiResponse = require('../../utils/ApiResponse');
const Quiz = require('../../DB/model/quiz.model');
const Result = require('../../DB/model/result.model');
const User = require('../../DB/model/user.model');

const getAdminReports = asyncHandler(async (req, res) => {
  const [quizzesCount, resultsCount] = await Promise.all([
    Quiz.countDocuments(),
    Result.countDocuments()
  ]);

  const allResults = await Result.find().populate('quizId', 'title');
  
  let totalScore = 0;
  let passedCount = 0;
  
  allResults.forEach(r => {
    totalScore += (r.percentage || 0);
    if ((r.percentage || 0) >= 60) passedCount++;
  });

  const avgPassScore = resultsCount > 0 ? (totalScore / resultsCount).toFixed(1) : 0;

  const adminMetrics = [
    { label: "Quizzes Managed", value: quizzesCount.toString(), icon: "📝", color: "text-indigo-600 bg-indigo-50 border-indigo-100" },
    { label: "Active Submissions", value: resultsCount.toString(), icon: "📈", color: "text-emerald-600 bg-emerald-50 border-emerald-100" },
    { label: "Average Pass Score", value: `${avgPassScore}%`, icon: "🎯", color: "text-amber-600 bg-amber-50 border-amber-100" },
  ];

  // Group by quiz
  const quizMap = {};
  allResults.forEach(r => {
    const quizTitle = r.quizId?.title || 'Unknown Quiz';
    if (!quizMap[quizTitle]) {
      quizMap[quizTitle] = { totalAttempts: 0, totalScore: 0, passed: 0 };
    }
    quizMap[quizTitle].totalAttempts++;
    quizMap[quizTitle].totalScore += (r.percentage || 0);
    if ((r.percentage || 0) >= 60) quizMap[quizTitle].passed++;
  });

  const quizPerformance = Object.keys(quizMap).map(title => {
    const stat = quizMap[title];
    return {
      title,
      totalAttempts: stat.totalAttempts,
      avgScore: `${(stat.totalScore / stat.totalAttempts).toFixed(1)}%`,
      passRate: `${Math.round((stat.passed / stat.totalAttempts) * 100)}%`,
    };
  });

  res.send(new ApiResponse(200, 'Admin reports retrieved', { adminMetrics, quizPerformance }));
});

const getSuperAdminReports = asyncHandler(async (req, res) => {
  const { dateRange } = req.query; // '7', '30', '90', '365'
  
  let dateFilter = {};
  if (dateRange && dateRange !== '365') {
    const days = parseInt(dateRange);
    const date = new Date();
    date.setDate(date.getDate() - days);
    dateFilter = { createdAt: { $gte: date } };
  }

  const [results, usersCount] = await Promise.all([
    Result.find(dateFilter).populate('quizId', 'title category').populate('userId', 'name role'),
    User.countDocuments(dateFilter)
  ]);

  let totalScore = 0;
  let passedCount = 0;
  
  results.forEach(r => {
    totalScore += (r.percentage || 0);
    if ((r.percentage || 0) >= 60) passedCount++;
  });

  const avgScore = results.length > 0 ? (totalScore / results.length).toFixed(1) : 0;
  const passRate = results.length > 0 ? Math.round((passedCount / results.length) * 100) : 0;

  const summaryMetrics = [
    { label: "Total Platform Attempts", value: results.length.toString(), change: "+0%", icon: "📈", color: "text-emerald-600 bg-emerald-50 border-emerald-100" },
    { label: "Average Platform Score", value: `${avgScore}%`, change: "+0%", icon: "🎯", color: "text-indigo-600 bg-indigo-50 border-indigo-100" },
    { label: "Active Admins & Users", value: usersCount.toString(), change: "+0", icon: "👥", color: "text-violet-600 bg-violet-50 border-violet-100" },
    { label: "Global Pass Rate", value: `${passRate}%`, change: "+0%", icon: "🏆", color: "text-amber-600 bg-amber-50 border-amber-100" },
  ];

  // Top Quizzes
  const quizMap = {};
  results.forEach(r => {
    if (!r.quizId) return;
    const title = r.quizId.title;
    if (!quizMap[title]) {
      quizMap[title] = { title, category: r.quizId.category || 'General', attempts: 0, totalScore: 0, passed: 0 };
    }
    quizMap[title].attempts++;
    quizMap[title].totalScore += (r.percentage || 0);
    if ((r.percentage || 0) >= 60) quizMap[title].passed++;
  });

  const topPerformingQuizzes = Object.values(quizMap)
    .map(stat => ({
      title: stat.title,
      category: stat.category,
      attempts: stat.attempts,
      avgScore: `${(stat.totalScore / stat.attempts).toFixed(1)}%`,
      passRate: `${Math.round((stat.passed / stat.attempts) * 100)}%`,
    }))
    .sort((a, b) => b.attempts - a.attempts)
    .slice(0, 5);

  const recentUserActivity = results
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 10)
    .map(r => ({
      id: r._id,
      user: r.userId?.name || 'Unknown',
      role: r.userId?.role || 'User',
      quiz: r.quizId?.title || 'Unknown',
      score: `${Math.round(r.percentage || 0)}%`,
      status: (r.percentage || 0) >= 60 ? 'Passed' : 'Failed',
      date: new Date(r.createdAt).toLocaleString(),
    }));

  res.send(new ApiResponse(200, 'Super admin reports retrieved', { summaryMetrics, topPerformingQuizzes, recentUserActivity }));
});

module.exports = {
  getAdminReports,
  getSuperAdminReports,
};
