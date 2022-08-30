const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const SESSION_KEY = process.env.SESSION_KEY;

module.exports = {
    signup: async (req, res) => {
        const { email, password } = req.body;
        try {
            const user = await User.findOne({ email });
            if (user) {
                return res.status(400).json({
                    message: 'User already exists'
                });
            }
            const hashedPassword = await bcrypt.hash(password, 12);
            const newUser = new User({
                email,
                password: hashedPassword
            });
            await newUser.save();
            const token = jwt.sign({ userId: newUser._id }, SESSION_KEY, { expiresIn: '1h' });
            console.log(token);
            res.status(201).json({
                message: 'User created successfully',
                token
            });
        } catch (err) {
            res.status(500).json({
                message: 'Something went wrong'
            });
        }
    },

    login: async (req, res) => {
        const { email, password } = req.body;
        try {

            const user = await User.findOne({ email });
            if (!user) {
                return res.status(400).json({
                    message: 'User does not exist'
                });
            }

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(400).json({
                    message: 'Invalid credentials'
                });
            }

            const token = jwt.sign({ userId: user._id }, SESSION_KEY, { expiresIn: '24h' });
            res.status(200).json({
                userId: user._id,
                token
            });

        } catch (err) {
            res.status(500).json({
                message: 'Something went wrong'
            });
        }
    }
}




