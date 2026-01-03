var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const rateLimit = require('express-rate-limit');
const session = require('express-session');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var scanRouter = require('./routes/scan');

var app = express();

/* ================================
   TRUST PROXY (Railway / Cloud)
================================ */
app.set('trust proxy', 1);

/* ================================
   VIEW ENGINE
================================ */
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

/* ================================
   MIDDLEWARES
================================ */
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

/* ================================
   RATE LIMIT (SCANNER)
================================ */
const scanLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 20,                 // 20 scans por IP
  standardHeaders: true,
  legacyHeaders: false
});

/* ================================
   SESSION (MVP SAFE)
================================ */
app.use(session({
  secret: process.env.SESSION_SECRET || 'frontend-security-demo-secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 24 * 60 * 60 * 1000, // 24h
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax'
  }
}));

/* ================================
   HEALTH CHECK (Railway)
================================ */
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

/* ================================
   ROUTES
================================ */
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/scanner', scanLimiter, scanRouter);

/* ================================
   404 HANDLER
================================ */
app.use(function(req, res, next) {
  next(createError(404));
});

/* ================================
   ERROR HANDLER
================================ */
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;