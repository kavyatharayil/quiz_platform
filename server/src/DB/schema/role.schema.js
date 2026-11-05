const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    usersCount: {
      type: Number,
      default: 0,
    },
    isSystem: {
      type: Boolean,
      default: false,
    },
    permissions: {
      dashboard: { type: String, default: 'None' },
      users: { type: String, default: 'None' },
      roles: { type: String, default: 'None' },
      quizzes: { type: String, default: 'None' },
      questions: { type: String, default: 'None' },
      categories: { type: String, default: 'None' },
      attempts: { type: String, default: 'None' },
      results: { type: String, default: 'None' },
      reports: { type: String, default: 'None' },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = roleSchema;
