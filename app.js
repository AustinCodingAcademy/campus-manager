var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var bodyParser = require('body-parser');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var flash = require('express-flash');
var cors = require('cors')

var routes = require('./routes/index');
var users = require('./routes/users');
var terms = require('./routes/terms');
var courses = require('./routes/courses');

var passport = require('./config/passport');

var auth = require('./routes/middleware').auth;

var mongo_url = process.env.MONGOLAB_URI || require('./config/env').mongo_url;
var rollbar = require('rollbar');
var rollbarAccessToken = process.env.ROLLBAR_ACCESS_TOKEN || require('./config/env').rollbarAccessToken

var app = express();
app.use(cors());

var mongoose = require('mongoose');
mongoose.connect(mongo_url);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(flash());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: 'foo',
  store: new MongoStore({ mongooseConnection: mongoose.connection })
}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/', routes);
app.use('/api/users', auth, users);
app.use('/api/terms', auth, terms);
app.use('/api/courses', auth, courses);
app.use(rollbar.errorHandler(rollbarAccessToken));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: err
  });
});


module.exports = app;
