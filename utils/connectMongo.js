const mongoose = require('mongoose');

const connectMongo = (connection) =>
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
    .then(() => console.log(`${connection} is integrated with MongoDB!`))
    .catch((error) => console.error(error));

module.exports = connectMongo;
