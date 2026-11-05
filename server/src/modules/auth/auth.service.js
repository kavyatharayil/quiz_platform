const User = require('../../DB/model/user.model');
const ApiError = require('../../utils/ApiError');
const { generateAuthTokens } = require('../../utils/jwt');

const registerUser = async (userBody) => {
  if (await User.isEmailTaken(userBody.email)) {
    throw new ApiError(400, 'Email already taken');
  }
  const user = await User.create(userBody);
  const tokens = generateAuthTokens(user.id);
  return { user, tokens };
};

const loginUserWithEmailAndPassword = async (email, password) => {
  const user = await User.findOne({ email }).populate('blockedBy', 'email');
  if (!user || !(await user.isPasswordMatch(password))) {
    throw new ApiError(401, 'Incorrect email or password');
  }
  if (user.status === 'Blocked') {
    const adminEmail = user.blockedBy ? user.blockedBy.email : 'an administrator';
    throw new ApiError(403, `Admin / Super Admin blocked. Reach us at ${adminEmail}`);
  }
  const tokens = generateAuthTokens(user.id);
  return { user, tokens };
};

module.exports = {
  registerUser,
  loginUserWithEmailAndPassword,
};
