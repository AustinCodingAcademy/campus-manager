var express = require('express');
var app = express();

if (process.env.NODE_ENV === 'test') {
  process.env.MONGOLAB_URI = process.env.TEST_DB;
}

if (['test', 'production'].indexOf(process.env.NODE_ENV) === -1) {
  require('dotenv').config();
}

var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var flash = require('express-flash');
var cookieParser = require('cookie-parser');
var csrf = require('csurf');
var compression = require('compression');
var forceSSL = require('express-force-ssl');

var passport = require('./config/passport');

var methodOverride = require('method-override')

var middleware = require('./routes/middleware');

app.use(methodOverride('_method'));

var mongoose = require('mongoose');
mongoose.connect(process.env.MONGOLAB_URI);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(bodyParser.json({ limit: '200kb' }));
app.use(bodyParser.urlencoded({ extended: false }));
if (process.env.NODE_ENV === 'production') {
  app.use(forceSSL);
}
app.use(flash());
app.use(express.static(path.join(__dirname, 'public')));

app.use(function (req, res, next) {
  let key = 'austin'
  switch (req.headers.host.split('.')[1]) {
    case 'sanantoniocodingacademy':
      key = 'sanantonio';
      break;
    case 'dallascodingacademy':
      key = 'dallas';
      break;
    case 'houstontxcodingacademy':
      key = 'houstontx';
      break;
  }
  res.locals = {
    campusKey: key
  };
  next();
});

mongoose.Promise = global.Promise;
app.use(session({
  secret: process.env.SESSION_KEY,
  store: new MongoStore({ mongooseConnection: mongoose.connection }),
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(cookieParser());
app.use(csrf({cookie: true}));
// compress all responses
app.use(compression({ threshold: 0 }))

app.use('/docs', express.static(path.join(__dirname + '/docs')));
app.use('/', require('./routes/index'));
app.use('/reset', require('./routes/reset'));
app.use('/api/users', middleware.auth, require('./routes/users'));
app.use('/api/terms', require('./routes/terms'));
app.use('/api/courses', middleware.auth, require('./routes/courses'));
app.use('/api/charges', middleware.auth, require('./routes/charges'));
app.use('/api/locations', middleware.auth, require('./routes/locations'));
app.use('/api/import', middleware.admin, require('./routes/import'));
app.use('/api/report', middleware.admin, require('./routes/report'));
app.use('/api/grades', middleware.auth, require('./routes/grades'));
app.use('/api/textbooks', middleware.admin, require('./routes/textbooks'));
app.use('/api/registrations', middleware.auth, require('./routes/registrations'));

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
  console.log(err.message);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
