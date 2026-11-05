const mongoose = require('mongoose');
const resultSchema = require('../schema/result.schema');

const Result = mongoose.model('Result', resultSchema);

module.exports = Result;
