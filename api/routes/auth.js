const router = require('express').Router();
const LoginValidation = require('../middleware/validation').LoginValidation;
const SignupValidation = require('../middleware/validation').SignupValidation;
const authController = require('../controllers/auth.controller');

// Signup route
router.post('/signup', SignupValidation, authController.Signup);

// Login route
router.post('/login', LoginValidation, authController.Login);

// Export router
module.exports = router;