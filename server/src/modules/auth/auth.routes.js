const express = require('express');
const validate = require('../../middleware/validate');
const authValidation = require('./auth.validator');
const authController = require('./auth.controller');

const router = express.Router();

router.post('/register', validate(authValidation.register), authController.register);
router.post('/login', validate(authValidation.login), authController.login);
router.post('/logout', authController.logout);

module.exports = router;
