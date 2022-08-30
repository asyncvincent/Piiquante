const router = require('express').Router();
const authController = require('../controllers/auth.controller');
const validation = require('../middleware/validation');

router.post('/signup', validation.signupValidation, authController.signup);

module.exports = router;