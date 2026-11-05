const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../../.env') });

module.exports = {
  env: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 5000,
  mongoose: {
    url: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/quiz-platform',
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'secret',
    accessExpiration: process.env.JWT_EXPIRES_IN || '3d',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'refresh_secret',
    refreshExpiration: process.env.JWT_REFRESH_EXPIRES_IN || '30d',
  },
};
