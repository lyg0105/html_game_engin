var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var cors = require('cors');
var logger = require('morgan');

global.LottoConstant=require('./config/my_constant');
global.LottoConstant.conn_pools = require('./model/static/db_pool');//db_pool 전역변수

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var apiRouter = require('./routes/api');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json({limit : "100mb"}));
app.use(express.urlencoded({ extended: true,limit:"100mb",parameterLimit: 100000000 }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

var corsOptionsDelegate = function (req, callback) {
  let allow_list = global.LottoConstant.ALLOW_URL_ARR;
  let corsOptions;
  if(allow_list.indexOf(req.header('origin')) !== -1){
    corsOptions = { origin: true,credentials: true };
  } else {
    corsOptions = { origin: false };
  }
  callback(null, corsOptions) // callback expects two parameters: error and options
}

// app.use('/', indexRouter);
// app.use('/users', usersRouter);
app.use('/api',cors(corsOptionsDelegate), apiRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
