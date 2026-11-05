const express = require('express');
const authenticate = require('../../middleware/authenticate');
const authorize = require('../../middleware/authorize');
const { ROLES } = require('../../constants/roles');
const roleController = require('./role.controller');
const validateObjectId = require('../../middleware/validateObjectId');

const router = express.Router();

router
  .route('/')
  .get(
    authenticate,
    authorize(ROLES.SUPER_ADMIN),
    roleController.getRoles
  )
  .post(
    authenticate,
    authorize(ROLES.SUPER_ADMIN),
    roleController.createRole
  );

router
  .route('/:id')
  .patch(
    authenticate,
    authorize(ROLES.SUPER_ADMIN),
    validateObjectId(),
    roleController.updateRole
  )
  .delete(
    authenticate,
    authorize(ROLES.SUPER_ADMIN),
    validateObjectId(),
    roleController.deleteRole
  );

module.exports = router;
