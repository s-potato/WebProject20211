var express = require('express');
var path = require('path');
var cors = require('cors');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var roomsRouter = require('./routes/rooms');

var app = express();
app.use(cors());
app.use(express.json({limit: '10mb'}));
app.use(express.urlencoded({ limit: '10mb', extended: false }));

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/rooms', roomsRouter);
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.json(err);
  });

module.exports = app;
