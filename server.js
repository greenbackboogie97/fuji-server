require('dotenv').config();
const server = require('./app');
const mongoose = require('mongoose');

mongoose
  .connect(
    process.env.DB_CLUSTER_CONNECTION.replace(
      '<password>',
      process.env.DB_PASSWORD
    ),
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    }
  )
  .then(() => console.log('server is integrated with MongoDB!'))
  .catch((err) => console.error(err));

const PORT = process.env.PORT || 5000;

server.listen(PORT, () =>
  console.log(`${process.env.NODE_ENV} server is listening on port ${PORT}..`)
);

process.on('unhandledRejection', (err) => {
  console.error(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

process.on('uncaughtException', (err) => {
  console.log(err);
  server.close(() => {
    process.exit(1);
  });
});
