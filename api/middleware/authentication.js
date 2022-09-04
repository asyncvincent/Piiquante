const jwt = require('jsonwebtoken');
const SESSION_KEY = process.env.SESSION_KEY;

module.exports = {

    // Authentication middleware
    Authentication: (req, res, next) => {

        try {

            // Get token from headers
            const token = req.headers.authorization.split(' ')[1];

            // Decode token with session key
            const decodedToken = jwt.verify(token, SESSION_KEY);

            // Get user id from decoded token 
            const userId = decodedToken.userId;

            // Check if user id exists
            if (req.body.userId && req.body.userId !== userId) {
                // Return error
                throw "L'identifiant de l'utilisateur n'est pas valide";
            } else {
                // Call next middleware
                next();
            }
        } catch (err) { // Catch errors
            return res.status(401).json({
                message: "Authentification échouée"
            });
        }
    }
}