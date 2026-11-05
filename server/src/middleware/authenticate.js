const jwt = require('jsonwebtoken');
const config = require('../config/env');
const ApiError = require('../utils/ApiError');
const User = require('../DB/model/user.model');
const asyncHandler = require('../utils/asyncHandler');

const authenticate = asyncHandler(async (req, res, next) => {
  let token = req.cookies?.token;
  
  if (!token && req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    throw new ApiError(401, 'Please authenticate');
  }

  try {
    const decoded = jwt.verify(token, config.jwt.secret);
    const user = await User.findById(decoded.sub);
    
    if (!user) {
      console.log('AUTH FAILED: User not found in DB for ID:', decoded.sub);
      throw new ApiError(401, 'User not found');
    }
    
    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      console.log('AUTH FAILED: Token expired');
      throw new ApiError(401, 'Token expired');
    }
    console.log('AUTH FAILED: catch block reached. Error:', error.message);
    throw new ApiError(401, 'Please authenticate');
  }
});

module.exports = authenticate;
