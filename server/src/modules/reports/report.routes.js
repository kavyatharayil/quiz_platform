const express = require('express');
const authenticate = require('../../middleware/authenticate');
const authorize = require('../../middleware/authorize');
const { ROLES } = require('../../constants/roles');
const reportController = require('./report.controller');

const router = express.Router();

router
  .route('/admin')
  .get(
    authenticate,
    authorize(ROLES.ADMIN, ROLES.SUPER_ADMIN),
    reportController.getAdminReports
  );

router
  .route('/superadmin')
  .get(
    authenticate,
    authorize(ROLES.SUPER_ADMIN),
    reportController.getSuperAdminReports
  );

module.exports = router;
