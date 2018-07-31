const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(express.static(publicPath, {}));

app.get('/', (req, res) => {
  res.send('hello world');
});

io.on('connection', socket => {
  console.log('New user connected');

  socket.emit('newMessage', {
    from: 'test@test.ua',
    text: 'Hey bruh!',
    createdAt: null
  });

  socket.on('createMessage', newEmail => {
    console.log(newEmail);
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

server.listen(port, () => console.log(`Server is up on ${port}`));