const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
const session = require('cookie-session');
const helmet = require('helmet');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.log('Error:', err.message);
});

app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));

app.use(session({
    name: 'session',
    keys: [process.env.SESSION_KEY],
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    cookie: {
        secure: true,
        httpOnly: true,
        domain: 'localhost:3000'
    }
}));

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Security-Policy', "default-src 'self'");
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET, UPDATE');
        return res.status(200).json({
            message: 'OK'
        });
    }
    next();
}).use(bodyParser.json());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/sauces', require('./routes/sauce'));

module.exports = app;