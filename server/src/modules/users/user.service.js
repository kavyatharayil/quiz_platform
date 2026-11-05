const User = require('../../DB/model/user.model');
const ApiError = require('../../utils/ApiError');

const getAllUsers = async () => {
  return await User.find().select('-password').lean();
};

const updateUserStatus = async (id, status, adminId) => {
  const user = await User.findById(id);
  if (!user) {
    throw new ApiError(404, 'User not found');
  }
  user.status = status;
  if (status === 'Blocked') {
    user.blockedBy = adminId;
  } else {
    user.blockedBy = undefined;
  }
  await user.save();
  
  const updatedUser = user.toObject();
  delete updatedUser.password;
  return updatedUser;
};

module.exports = {
  getAllUsers,
  updateUserStatus,
};
