const express = require('express');
const validateObjectId = require('../../middleware/validateObjectId');
const authenticate = require('../../middleware/authenticate');
const authorize = require('../../middleware/authorize');
const { ROLES } = require('../../constants/roles');
const resultController = require('../results/result.controller');
const userController = require('./user.controller');

const router = express.Router();

// Admin routes for user management
router
  .route('/')
  .get(
    authenticate,
    authorize(ROLES.ADMIN, ROLES.SUPER_ADMIN),
    userController.getUsers
  );

router
  .route('/:id/status')
  .patch(
    authenticate,
    authorize(ROLES.ADMIN, ROLES.SUPER_ADMIN),
    validateObjectId(),
    userController.updateUserStatus
  );

// For now, we only need the user's results route as specified.
router
  .route('/:id/results')
  .get(
    authenticate,
    validateObjectId(),
    resultController.getUserResults
  );

module.exports = router;
