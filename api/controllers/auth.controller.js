const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const SESSION_KEY = process.env.SESSION_KEY;

module.exports = {

    // Create new user account 
    Signup: async (req, res) => {

        // Get email and password from request body
        const { email, password } = req.body;

        // Hash password with bcrypt
        const hashedPassword = await bcrypt.hash(password, 12);

        // Create new user 
        const user = new User({
            email,
            password: hashedPassword
        });

        // Create token with jwt
        const token = jwt.sign({ userId: user._id }, SESSION_KEY, { expiresIn: '24h' });

        // Save user in database
        await user.save()
            .then(() => res.status(200).json({
                message: "L'utilisateur a été créé avec succès",
                token
            }))
            .catch(error => res.status(400).json({
                error: "L'utilisateur n'a pas pu être créé",
                message: error.message
            }));

    },

    // Login user account
    Login: async (req, res) => {

        // Get email and password from request body
        const { email, password } = req.body;

        // Find user in database
        const user = await User.findOne({ email });

        // If user doesn't exist
        if (!user) {
            return res.status(401).json({
                error: "L'utilisateur n'existe pas",
                errorType: "userNotFound"
            });
        }

        // Compare password with hashed password in database with bcrypt
        const pwdMatch = await bcrypt.compare(password, user.password);

        // Create token with jwt
        const token = jwt.sign({ userId: user._id }, SESSION_KEY, { expiresIn: '24h' });

        req.session.token = {
            token
        }

        // Check if email and password match
        if (!pwdMatch) {
            return res.status(401).json({
                error: "Le mot de passe est incorrect",
                errorType: "PasswordIncorrect"
            });
        }

        // Return user data
        res.status(200).json({
            message: "L'utilisateur a été connecté avec succès",
            userId: user._id,
            token
        });
    }
}