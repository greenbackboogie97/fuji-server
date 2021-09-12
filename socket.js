const server = require('./app');
const Conversation = require('./models/ConversationModel');
const socketServer = require('http').createServer(server);
const io = require('socket.io')(socketServer, {
  cors: { origin: 'https://fujiclient.netlify.app' },
});

let connectedUsers = {};

io.use((socket, next) => {
  const userID = socket.handshake.auth.userID;
  socket.userID = userID;
  connectedUsers[userID] = socket.id;
  next();
});

io.on('connection', (socket) => {
  socket.on('disconnecting', () => {
    delete connectedUsers[socket.userID];
  });

  socket.on('disconnect', () => {
    socket.emit('users', connectedUsers);
    console.log(`socket ID: ${socket.id} disconnected.`);
  });

  socket.on('contacts', (contacts) => {
    contacts.forEach((contact) => {
      for (const [userID, socketID] of Object.entries(connectedUsers)) {
        if (userID === contact.user._id) contact.socket = socketID;
      }
    });
    io.to(socket.id).emit('contacts', contacts);
  });

  socket.on('message', async (payload) => {
    const { content, conversationID, from } = payload;
    const sentAt = Date.now();
    const conversation = await Conversation.findById(conversationID);
    conversation.messages.push({ from, content, sentAt });
    await conversation.save();

    const to = conversation.participants.filter((user) => user != from)[0];
    const connected = Boolean(connectedUsers[to]);

    if (connected) {
      return io
        .to(connectedUsers[to])
        .emit('message', { from, content, sentAt });
    }
  });
});

module.exports = socketServer;
