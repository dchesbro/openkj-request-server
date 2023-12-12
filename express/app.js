var cookieParser = require('cookie-parser');
var cors = require('cors');
var express = require('express');
var logger = require('morgan');
var path = require('path');

var apiRouter = require('./routes/api');
var publicRouter = require('./routes/index');

var app = express();

app.use(logger('dev'));
app.use(express.json({ limit: '64mb' }));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', publicRouter);
app.use('/api', cors(), apiRouter);

module.exports = app;
