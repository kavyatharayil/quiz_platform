const express = require('express');
const authenticate = require('../../middleware/authenticate');
const authorize = require('../../middleware/authorize');
const { ROLES } = require('../../constants/roles');
const dashboardController = require('./dashboard.controller');

const router = express.Router();

router
  .route('/stats')
  .get(
    authenticate,
    authorize(ROLES.ADMIN, ROLES.SUPER_ADMIN),
    dashboardController.getDashboardStats
  );

module.exports = router;
