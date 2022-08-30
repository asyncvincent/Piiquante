const jwt = require('jsonwebtoken');

const secret = process.env.SECRET;

module.exports = {
    try(req, res, next) {
        const token = req.header('Authorization');
        if (!token) {
            return res.status(401).json({
                message: 'No token provided'
            });
        }
        try {
            const decoded = jwt.verify(token, secret);
            req.user = decoded;
            next();
        } catch (err) {
            return res.status(401).json({
                message: 'Invalid token'
            });
        }
    }
}
