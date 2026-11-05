const ApiError = require('../utils/ApiError');
const config = require('../config/env');
const mongoose = require('mongoose');

const errorHandler = (err, req, res, next) => {
  let error = err;

  if (!(error instanceof ApiError)) {
    const statusCode = error.statusCode || error instanceof mongoose.Error ? 400 : 500;
    const message = error.message || 'Internal Server Error';
    error = new ApiError(statusCode, message, null, false, err.stack);
  }

  const response = {
    success: false,
    message: error.message,
    ...(error.data && { data: error.data }),
    ...(config.env === 'development' && { stack: error.stack }),
  };

  res.status(error.statusCode).send(response);
};

module.exports = errorHandler;
