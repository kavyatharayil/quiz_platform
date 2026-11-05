const Quiz = require('../../DB/model/quiz.model');
const Question = require('../../DB/model/question.model');
const paginate = require('../../utils/pagination');

const createQuiz = async (quizBody) => {
  return Quiz.create(quizBody);
};

const getQuizzes = async (filter = {}, options = {}) => {
  const populate = { path: 'createdBy', select: 'name email' };
  const paginated = await paginate(Quiz, filter, { ...options, populate });
  
  const quizzesWithCounts = await Promise.all(
    paginated.results.map(async (quiz) => {
      const questionCount = await Question.countDocuments({ quizId: quiz._id });
      const quizObj = quiz.toObject ? quiz.toObject() : quiz;
      return { ...quizObj, questionCount };
    })
  );

  return { 
    quizzes: quizzesWithCounts, 
    page: paginated.page, 
    limit: paginated.limit, 
    totalPages: paginated.totalPages, 
    totalResults: paginated.totalResults 
  };
};

const getQuizById = async (id) => {
  return Quiz.findById(id).populate('createdBy', 'name email');
};

const updateQuizById = async (id, updateBody) => {
  return Quiz.findByIdAndUpdate(id, updateBody, { returnDocument: "after", runValidators: true });
};

const deleteQuizById = async (id) => {
  return Quiz.findByIdAndDelete(id);
};

module.exports = {
  createQuiz,
  getQuizzes,
  getQuizById,
  updateQuizById,
  deleteQuizById,
};
