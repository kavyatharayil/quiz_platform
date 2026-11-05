const asyncHandler = require('../../utils/asyncHandler');
const userService = require('./user.service');
const ApiResponse = require('../../utils/ApiResponse');

const getUsers = asyncHandler(async (req, res) => {
  const users = await userService.getAllUsers();
  res.send(new ApiResponse(200, 'Users retrieved successfully', users));
});

const updateUserStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const adminId = req.user._id;
  const user = await userService.updateUserStatus(req.params.id, status, adminId);
  res.send(new ApiResponse(200, 'User status updated successfully', user));
});

module.exports = {
  getUsers,
  updateUserStatus,
};
