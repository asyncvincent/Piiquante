const router = require('express').Router();
const validation = require('../middleware/validation');
const authController = require('../controllers/auth.controller');

router.post('/signup', validation.signupValidation, authController.signup);
router.post('/login', validation.loginValidation, authController.login);

module.exports = router;