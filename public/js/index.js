const socket = io();

socket.on('connect', () => {
  console.log('connected to server')

  socket.emit('createMessage', {
    from: 'test@test.666',
    text: 'wossap'
  });
});

socket.on('disconnect', () => {
  console.log('disconnected from server');
})

socket.on('newMessage', email => {
  console.log(email);
});
