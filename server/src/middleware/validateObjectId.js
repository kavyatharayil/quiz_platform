const mongoose = require('mongoose');
const ApiError = require('../utils/ApiError');

const validateObjectId = (paramName = 'id') => {
  return (req, res, next) => {
    const id = req.params[paramName];
    if (id && !mongoose.Types.ObjectId.isValid(id)) {
      return next(new ApiError(400, `Invalid ID format for ${paramName}`));
    }
    next();
  };
};

module.exports = validateObjectId;
