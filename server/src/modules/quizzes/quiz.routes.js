const express = require('express');
const validate = require('../../middleware/validate');
const validateObjectId = require('../../middleware/validateObjectId');
const authenticate = require('../../middleware/authenticate');
const authorize = require('../../middleware/authorize');
const { ROLES } = require('../../constants/roles');
const quizValidation = require('./quiz.validator');
const quizController = require('./quiz.controller');
const resultController = require('../results/result.controller');
const resultValidation = require('../results/result.validator');
const questionController = require('../questions/question.controller');
const questionValidation = require('../questions/question.validator');

const router = express.Router();

router
  .route('/:id/start')
  .post(
    authenticate,
    validateObjectId(),
    resultController.startQuiz
  );

router
  .route('/:id/submit')
  .post(
    authenticate,
    validateObjectId(),
    validate(resultValidation.submitQuiz),
    resultController.submitQuiz
  );

router
  .route('/:quizId/questions')
  .get(
    authenticate,
    validateObjectId('quizId'),
    questionController.getQuestions
  )
  .post(
    authenticate,
    authorize(ROLES.ADMIN, ROLES.SUPER_ADMIN),
    validateObjectId('quizId'),
    validate(questionValidation.createQuestion),
    questionController.createQuestion
  );

router
  .route('/')
  .post(
    authenticate,
    authorize(ROLES.ADMIN, ROLES.SUPER_ADMIN),
    validate(quizValidation.createQuiz),
    quizController.createQuiz
  )
  .get(
    authenticate,
    quizController.getQuizzes
  );

router
  .route('/:id')
  .get(
    authenticate,
    validateObjectId(),
    quizController.getQuiz
  )
  .put(
    authenticate,
    authorize(ROLES.ADMIN, ROLES.SUPER_ADMIN),
    validateObjectId(),
    validate(quizValidation.updateQuiz),
    quizController.updateQuiz
  )
  .delete(
    authenticate,
    authorize(ROLES.ADMIN, ROLES.SUPER_ADMIN),
    validateObjectId(),
    quizController.deleteQuiz
  );

module.exports = router;
