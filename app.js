const express = require('express');
const app = express();
const cors = require('cors');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const usersRouter = require('./routes/usersRouter');
const friendsRouter = require('./routes/friendsRouter');
const postsRouter = require('./routes/postsRouter');
const mediaRouter = require('./routes/mediaRouter');
const errorCluster = require('./controllers/errorController');
const AppError = require('./utils/appError');

app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
  })
);

app.use(helmet());
app.use(express.json({ limit: '10mb' }));
app.use(mongoSanitize());
app.use(xss());

app.use('/users', usersRouter);
app.use('/friends', friendsRouter);
app.use('/posts', postsRouter);
app.use('/media', mediaRouter);
app.all('*', (req, res, next) =>
  next(new AppError(`Sorry this page does'nt exist.`, 404))
);

app.use(errorCluster);

module.exports = app;
