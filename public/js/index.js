const socket = io();

socket.on('connect', () => {
  console.log('connected to server')
});

socket.on('disconnect', () => {
  console.log('disconnected from server');
})

socket.on('newMessage', message => {
  const li = $('<li></li>');

  li.text(`${message.from}: ${message.text}`);

  $('#messages').append(li);
})

$('#message-form').on('submit', e => {
  e.preventDefault();

  socket.emit('createMessage', {
    from: 'user',
    text: $('[name=message]').val()
  }, () => {

  });
});
