const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
// const morgan = require('morgan');
const cookieParser = require('cookie-parser');

const app = express();
const usersRouter = require('./routes/usersRouter');
const friendsRouter = require('./routes/friendsRouter');
const postsRouter = require('./routes/postsRouter');
const errorCluster = require('./controllers/errorController');
const AppError = require('./utils/appError');

// MIDDLEWARES
// const corsOptions = {
//   origin: '*',
//   allowedHeaders: ['Content-Type', 'Authorization'],
// };
app.use(cors());

// Security HTTP Headers
app.use(helmet());

// Morgan Request Log
// if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

// API Rate Limiting
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many request from this IP! Please try again in an hour.',
});

app.use('/api', limiter);

//Body parser and body payload limit
app.use(express.json({ limit: '10kb' }));

//Data sanitization against NOSQL querry injections
app.use(mongoSanitize());

//Data sanitization against XSS
app.use(xss());

app.use(cookieParser);

// ROUTES
app.use('/users', usersRouter);
app.use('/friends', friendsRouter);
app.use('/posts', postsRouter);
app.all('*', (req, res, next) =>
  next(new AppError(`Sorry this page does'nt exist.`, 404))
);

app.use(errorCluster);

module.exports = app;
