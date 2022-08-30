const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const secret = process.env.SECRET;

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
            const token = jwt.sign({ userId: newUser._id }, secret, { expiresIn: '1h' });
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
            const token = jwt.sign({ userId: user._id }, secret, { expiresIn: '1h' });
            res.status(200).json({
                message: 'User logged in successfully',
                token
            });
        } catch (err) {
            res.status(500).json({
                message: 'Something went wrong'
            });
        }
    }
}




