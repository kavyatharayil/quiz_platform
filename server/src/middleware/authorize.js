const ApiError = require('../utils/ApiError');

const authorize = (...requiredRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new ApiError(401, 'Please authenticate'));
    }

    if (requiredRoles.length && !requiredRoles.includes(req.user.role)) {
      return next(new ApiError(403, 'Forbidden: Insufficient permissions'));
    }

    next();
  };
};

module.exports = authorize;
