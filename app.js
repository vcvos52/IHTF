const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session');

// Loads Page
const indexRouter = require('./routes/index');
// Handles User api requests
const usersRouter = require('./routes/users');
// Handles User api requests
const requestsRouter = require('./routes/requests');
// Handles Open id connect route
const openIdRouter = require('./routes/openidconnect');

const app = express();
app.use(session({ secret: "6170", resave: true, saveUninitialized: true }));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'dist')));

app.use('/', indexRouter);
app.use('/api/users', usersRouter);
app.use('/api/requests', requestsRouter);
app.use("/logging", openIdRouter);

app.get("*", function (req, res) {
    res
        .status(404)
        .json(
            "It looks like you got lost! Make sure not to add any extension to the URL and try again"
        );
});

module.exports = app;
