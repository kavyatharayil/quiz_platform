const { ZodError } = require('zod');
const ApiError = require('../utils/ApiError');

const validate = (schema) => (req, res, next) => {
  try {
    schema.parse({
      body: req.body,
      query: req.query,
      params: req.params,
    });
    next();
  } catch (error) {
    console.error('Zod Validation Error object:', error);
    if (error instanceof ZodError) {
      const errorMessage = (error.errors || error.issues || []).map((details) => details.message).join(', ');
      return next(new ApiError(400, errorMessage));
    }
    next(error);
  }
};

module.exports = validate;
