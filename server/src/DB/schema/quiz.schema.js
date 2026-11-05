const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    duration: {
      type: Number,
      required: true,
      min: 1, // minutes
    },
    totalMarks: {
      type: Number,
      required: true,
      min: 1,
    },
    category: {
      type: String,
      trim: true,
      default: 'General',
    },
    type: {
      type: String,
      enum: ['IT', 'Non-IT'],
      default: 'IT',
    },
    level: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced'],
      default: 'Beginner',
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    saveunknown:true,
    timestamps: true,
  }
);

module.exports = quizSchema;
