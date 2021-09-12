require('dotenv').config();
const server = require('./socketServer');
const connectMongo = require('./utils/connectMongo');

connectMongo(`${process.env.NODE_ENV} server`);

server.listen(process.env.PORT, () =>
  console.log(
    `${process.env.NODE_ENV} server is listening on port ${process.env.PORT}..`
  )
);
