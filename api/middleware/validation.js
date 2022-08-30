const {
    body,
    validationResult
} = require('express-validator');
const checkValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            message: errors.array()[0].msg
        });
    }
    next();
}

exports.signupValidation = [
    body('email').isEmail().withMessage(`Email must be a valid email`),
    body('password').isLength({
        min: 5
    }).withMessage(`Password must be at least 5 characters long`),
    // body('password')
    //     .isStrongPassword({
    //         minLength: 8,
    //         // minLowercase: 1,
    //         // minUppercase: 1,
    //         // minNumbers: 1,
    //         // minSymbols: 1
    //     })
    //     .withMessage(
    //         `Password must be at least 8 characters long, contain at least 1 lowercase letter, 1 uppercase letter, 1 number and 1 symbol`),
    (req, res, next) => {
        checkValidationErrors(req, res, next);
    }
];