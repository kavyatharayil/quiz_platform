const mongoose = require('mongoose');
const questionSchema = require('../schema/question.schema');

const Question = mongoose.model('Question', questionSchema);

module.exports = Question;
