const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema(
  {
    quizId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Quiz',
      required: true,
    },
    section: {
      type: String,
      trim: true,
      default: 'General',
    },
    question: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ['Multiple Choice', 'Technical & Logical'],
      default: 'Multiple Choice',
    },
    options: [
      {
        id: { type: String, required: true },
        text: { type: String, required: true },
      },
    ],
    correctAnswer: {
      type: String,
    },
    referenceAnswer: {
      type: String,
    },
    marks: {
      type: Number,
      required: true,
      min: 1,
    },
  },
  {
    saveunknown:true,
    timestamps: true,
  }
);

module.exports = questionSchema;
