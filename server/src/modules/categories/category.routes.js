const express = require('express');
const authenticate = require('../../middleware/authenticate');
const authorize = require('../../middleware/authorize');
const validateObjectId = require('../../middleware/validateObjectId');
const categoryController = require('./category.controller');
const { ROLES } = require('../../constants/roles');

const router = express.Router();

// Publicly accessible to get categories (e.g. for quiz creation/filtering)
router
  .route('/')
  .get(categoryController.getCategories)
  .post(
    authenticate,
    authorize(ROLES.ADMIN, ROLES.SUPER_ADMIN),
    categoryController.createCategory
  );

router
  .route('/:id')
  .put(
    authenticate,
    authorize(ROLES.ADMIN, ROLES.SUPER_ADMIN),
    validateObjectId(),
    categoryController.updateCategory
  )
  .delete(
    authenticate,
    authorize(ROLES.ADMIN, ROLES.SUPER_ADMIN),
    validateObjectId(),
    categoryController.deleteCategory
  );

module.exports = router;
