const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
const helmet = require('helmet');
const session = require("express-session")
require('dotenv').config();

// Session options 
app.use(session({
    name: "session-id",
    secret: process.env.SESSION_KEY,
    saveUninitialized: true,
    resave: true,
    cookie: {
        maxAge: 900000
    }
}));

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("Connexion à MongoDB réussie");
}).catch(err => {
    console.log('Error:', err.message);
});

// Helmet
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));

// Body parser 
app.use((req, res, next) => {

    // CORS headers
    res.header('Access-Control-Allow-Origin', 'http://localhost:4200');

    // Set custom headers for CORS
    res.setHeader('Content-Security-Policy', "default-src 'self'");

    // Set custom headers for CORS
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

    if (req.method === 'OPTIONS') {

        // Set custom headers for CORS
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET, UPDATE');
        return res.status(200).json();
    }

    next();
}).use(bodyParser.json());

// Routes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/sauces', require('./routes/sauce'));

// Error handling 404
app.use((req, res, next) => {
    const error = new Error('Not found 404');
    error.status = 404;
    next(error);
});

// Error handling 500
app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});

// Export app
module.exports = app;