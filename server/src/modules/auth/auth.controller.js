const asyncHandler = require('../../utils/asyncHandler');
const authService = require('./auth.service');
const ApiResponse = require('../../utils/ApiResponse');

const register = asyncHandler(async (req, res) => {
  const { user, tokens } = await authService.registerUser(req.body);
  const responseData = { user: { id: user.id, name: user.name, email: user.email, role: user.role } };
  
  res.cookie('token', tokens.accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  });
  res.cookie('isLoggedIn', 'true', {
    httpOnly: false,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000
  });

  res.status(201).send(new ApiResponse(201, 'User registered successfully', responseData));
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const { user, tokens } = await authService.loginUserWithEmailAndPassword(email, password);
  const responseData = { user: { id: user.id, name: user.name, email: user.email, role: user.role } };

  res.cookie('token', tokens.accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000
  });
  res.cookie('isLoggedIn', 'true', {
    httpOnly: false,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000
  });

  res.send(new ApiResponse(200, 'Login successful', responseData));
});

const logout = asyncHandler(async (req, res) => {
  res.clearCookie('token');
  res.clearCookie('isLoggedIn');
  res.send(new ApiResponse(200, 'Logout successful', {}));
});

module.exports = {
  register,
  login,
  logout
};
