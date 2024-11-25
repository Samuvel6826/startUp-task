// Load environment variables
require('dotenv').config();

var express = require('express');
const cors = require('cors');
var path = require('path');
var cookieParser = require('cookie-parser');
const createError = require('http-errors');
const { logger } = require('./utils/logger');
const connectToDatabase = require('./config/mongoDBconfig');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// In your Express app:
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// 404 Error Handler
app.use((req, res, next) => {
    next(createError(404));
});

if (!process.env.MONGODB_URL) {
    logger.error('MONGODB_URL is not defined in environment variables.');
    process.exit(1);
}

// Connect to the database
connectToDatabase();

module.exports = app;
