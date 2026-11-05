const resultRepository = require('./result.repository');
const quizService = require('../quizzes/quiz.service');
const questionService = require('../questions/question.service');
const { RESULT_STATUS } = require('../../constants/resultStatus');
const ApiError = require('../../utils/ApiError');

const startQuiz = async (userId, quizId) => {
  const quiz = await quizService.getQuizById(quizId);
  
  if (!quiz.isPublished) {
    throw new ApiError(403, 'Quiz is not published yet');
  }

  const activeAttempt = await resultRepository.getActiveAttempt(userId, quizId);
  if (activeAttempt) {
    const startedAtMs = new Date(activeAttempt.startedAt).getTime();
    const durationMs = quiz.duration * 60 * 1000;

    if (Date.now() <= startedAtMs + durationMs + (60 * 1000)) {
      return {
        attemptId: activeAttempt._id,
        quizId: activeAttempt.quizId,
        status: activeAttempt.status,
        startedAt: activeAttempt.startedAt,
      };
    } else {
      // Attempt has expired. Auto-close it with 0 score or current answers if we had them.
      // Since it's abandoned, we'll mark it as COMPLETED so they can start a new one if allowed.
      await resultRepository.updateResultById(activeAttempt._id, {
        status: RESULT_STATUS.COMPLETED,
        submittedAt: Date.now(),
      });
    }
  }

  const completedAttempts = await resultRepository.getCompletedAttempts(userId, quizId);
  if (completedAttempts.length >= 2) {
    throw new ApiError(403, 'Maximum attempts reached for this quiz', {
      attemptId: completedAttempts[completedAttempts.length - 1]._id
    });
  }

  if (completedAttempts.length === 1) {
    const firstAttempt = completedAttempts[0];
    if (firstAttempt.percentage >= 20) {
      throw new ApiError(403, 'You can only retry if your previous score was below 20%', {
        attemptId: firstAttempt._id
      });
    }
  }

  const result = await resultRepository.createResult({
    userId,
    quizId,
    status: RESULT_STATUS.IN_PROGRESS,
  });

  return {
    attemptId: result._id,
    quizId: result.quizId,
    status: result.status,
    startedAt: result.startedAt,
  };
};

const submitQuiz = async (userId, quizId, attemptId, submittedAnswers) => {
  const quiz = await quizService.getQuizById(quizId);
  const attempt = await resultRepository.getResultById(attemptId);

  if (!attempt) {
    throw new ApiError(404, 'Attempt not found');
  }

  if (attempt.userId.toString() !== userId.toString()) {
    throw new ApiError(403, 'Attempt does not belong to this user');
  }

  if (attempt.quizId._id.toString() !== quizId.toString()) {
    throw new ApiError(400, 'Attempt does not match this quiz');
  }

  if (attempt.status === RESULT_STATUS.COMPLETED) {
    throw new ApiError(400, 'Attempt is already submitted');
  }

  // Time Validation: ensure submission isn't excessively late
  const startedAtMs = new Date(attempt.startedAt).getTime();
  const durationMs = quiz.duration * 60 * 1000;
  const gracePeriodMs = 60 * 1000; // 60 seconds buffer for network delay
  
  if (Date.now() > startedAtMs + durationMs + gracePeriodMs) {
    // If they bypass the frontend and submit excessively late, we still process it,
    // but in a strict system we might throw an error or mark it invalid.
    // As per requirements: "validate in the backend" - we'll throw an error if it's too late.
    throw new ApiError(400, 'Time expired. Quiz submission rejected.');
  }

  // Get all questions from DB (admin role bypasses the correctAnswer filter)
  const dbQuestions = await questionService.getQuestionsByQuizId(quizId, 'ADMIN');
  
  let score = 0;
  let correctAnswersCount = 0;
  let wrongAnswersCount = 0;
  const processedAnswers = [];

  for (const dbQuestion of dbQuestions) {
    const submittedAnswer = submittedAnswers.find(a => a.questionId.toString() === dbQuestion._id.toString());
    const selectedAnswer = submittedAnswer ? submittedAnswer.selectedAnswer : null;
    const isCorrect = selectedAnswer === dbQuestion.correctAnswer;

    if (isCorrect) {
      score += dbQuestion.marks;
      correctAnswersCount++;
    } else if (selectedAnswer) {
      wrongAnswersCount++;
    }

    processedAnswers.push({
      questionId: dbQuestion._id,
      selectedAnswer,
      isCorrect,
      correctAnswer: dbQuestion.correctAnswer,
    });
  }

  const percentage = (score / quiz.totalMarks) * 100;

  const updateBody = {
    answers: processedAnswers,
    score,
    totalMarks: quiz.totalMarks,
    percentage,
    correctAnswers: correctAnswersCount,
    wrongAnswers: wrongAnswersCount,
    status: RESULT_STATUS.COMPLETED,
    submittedAt: Date.now(),
  };

  return resultRepository.updateResultById(attemptId, updateBody);
};

const getUserResults = async (userId, options) => {
  return resultRepository.getResults({ userId }, options);
};

const getResultById = async (resultId, userId, role) => {
  const result = await resultRepository.getResultById(resultId);
  if (!result) {
    throw new ApiError(404, 'Result not found');
  }
  
  if (role !== 'ADMIN' && result.userId.toString() !== userId.toString()) {
    throw new ApiError(403, 'Forbidden: Cannot access other users results');
  }
  
  return result;
};

const getAllResults = async (options) => {
  return resultRepository.getResults({}, options);
};

module.exports = {
  startQuiz,
  submitQuiz,
  getUserResults,
  getResultById,
  getAllResults,
};
