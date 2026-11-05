const mongoose = require('mongoose');
const { RESULT_STATUS } = require('../../constants/resultStatus');

const resultSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    quizId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Quiz',
      required: true,
    },
    answers: [
      {
        questionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Question' },
        selectedAnswer: { type: String },
        isCorrect: { type: Boolean },
        correctAnswer: { type: String },
      },
    ],
    score: {
      type: Number,
      default: 0,
    },
    totalMarks: {
      type: Number,
      default: 0,
    },
    percentage: {
      type: Number,
      default: 0,
    },
    correctAnswers: {
      type: Number,
      default: 0,
    },
    wrongAnswers: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: [RESULT_STATUS.IN_PROGRESS, RESULT_STATUS.COMPLETED],
      default: RESULT_STATUS.IN_PROGRESS,
    },
    startedAt: {
      type: Date,
      default: Date.now,
    },
    submittedAt: {
      type: Date,
    },
  },
  {
    saveunknown:true,
    timestamps: true,
  }
);

module.exports = resultSchema;
