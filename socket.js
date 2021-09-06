const server = require('./app');
const socketServer = require('http').createServer(server);
const io = require('socket.io')(socketServer, {
  cors: { origin: 'http://localhost:3000' },
});

io.on('connection', (socket) => {
  console.log('user has connected');
});

module.exports = socketServer;
