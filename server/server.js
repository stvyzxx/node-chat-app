const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;
const { generateMessage } = require('./utils/message');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(express.static(publicPath, {}));

app.get('/', (req, res) => {
  res.send('hello world');
});

io.on('connection', socket => {
  console.log('New user connected');

  socket.on('createMessage', (message, callback) => {
    console.log(message);
    io.emit('newMessage', generateMessage(message.from, message.text));
    callback('This is from server');
  });

  socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app'));
  
  socket.broadcast.emit('newMessage', generateMessage('Admin', 'New user joined'));

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

server.listen(port, () => console.log(`Server is up on ${port}`));