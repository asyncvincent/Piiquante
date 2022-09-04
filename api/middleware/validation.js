const {
    body,
    validationResult
} = require('express-validator');

// Check validation errors
function checkValidationErrors(req, res, next) {

    // Get validation errors
    const errors = validationResult(req);

    // Check if there are errors
    if (!errors.isEmpty()) {

        // Return errors
        return res.status(400).json({
            message: errors.array()[0].msg
        });
    }

    // Call next middleware
    next();
}

module.exports = {

    // Signup validation Middleware
    SignupValidation: [

        // Check email
        body('email').isEmail().withMessage({
            message: "L'adresse email n'est pas valide"
        }),

        // Check password
        body('password').isLength({
            min: 8
        }).withMessage({
            message: "Le mot de passe doit contenir au moins 8 caractères"
        }),

        // Check validation errors
        (req, res, next) => {
            checkValidationErrors(req, res, next);
        }
    ],

    // Login Validation Middleware
    LoginValidation: [

        // Check email
        body('email').isEmail().withMessage({
            message: "L'adresse email n'est pas valide"
        }),

        // Check validation errors
        (req, res, next) => {
            checkValidationErrors(req, res, next);
        }
    ]
};