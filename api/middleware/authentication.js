const jwt = require('jsonwebtoken');

const SESSION_KEY = process.env.SESSION_KEY;

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, SESSION_KEY);
        const userId = decodedToken.userId;

        if (req.body.userId && req.body.userId !== userId) {
            throw 'Invalid user ID';
        } else {
            next();
        }
    } catch (err) {
        console.log(err);
        res.status(401).json({
            error: new Error('Invalid request!')
        });
    }
}