const express = require('express');
const validate = require('../../middleware/validate');
const validateObjectId = require('../../middleware/validateObjectId');
const authenticate = require('../../middleware/authenticate');
const authorize = require('../../middleware/authorize');
const { ROLES } = require('../../constants/roles');
const questionValidation = require('./question.validator');
const questionController = require('./question.controller');

const router = express.Router();

// Routes for specific question management
router
  .route('/:id')
  .put(
    authenticate,
    authorize(ROLES.ADMIN, ROLES.SUPER_ADMIN),
    validateObjectId(),
    validate(questionValidation.updateQuestion),
    questionController.updateQuestion
  )
  .delete(
    authenticate,
    authorize(ROLES.ADMIN, ROLES.SUPER_ADMIN),
    validateObjectId(),
    questionController.deleteQuestion
  );

module.exports = router;
