const jwt = require('jsonwebtoken');
const config = require('../config/env');

const generateToken = (userId, secret, expiresIn) => {
  const payload = {
    sub: userId,
    iat: Math.floor(Date.now() / 1000),
  };
  return jwt.sign(payload, secret, { expiresIn });
};

const generateAuthTokens = (userId) => {
  const accessToken = generateToken(userId, config.jwt.secret, config.jwt.accessExpiration);
  const refreshToken = generateToken(userId, config.jwt.refreshSecret, config.jwt.refreshExpiration);
  
  return {
    accessToken,
    refreshToken
  };
};

const verifyToken = (token, isRefresh = false) => {
  const secret = isRefresh ? config.jwt.refreshSecret : config.jwt.secret;
  return jwt.verify(token, secret);
};

module.exports = {
  generateToken,
  generateAuthTokens,
  verifyToken,
};
