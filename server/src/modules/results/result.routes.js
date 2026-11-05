const express = require('express');
const validateObjectId = require('../../middleware/validateObjectId');
const authenticate = require('../../middleware/authenticate');
const resultController = require('./result.controller');

const authorize = require('../../middleware/authorize');
const { ROLES } = require('../../constants/roles');

const router = express.Router();

router
  .route('/')
  .get(
    authenticate,
    authorize(ROLES.ADMIN, ROLES.SUPER_ADMIN),
    resultController.getAllResults
  );

router
  .route('/:id')
  .get(
    authenticate,
    validateObjectId(),
    resultController.getResult
  );

module.exports = router;
