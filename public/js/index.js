const socket = io();

socket.on('connect', () => {
  console.log('connected to server')
});

socket.on('disconnect', () => {
  console.log('disconnected from server');
})

socket.on('newMessage', message => {
  const formattedTime = moment(message.createdAt).format('h:mm a')
  const li = $('<li></li>');

  li.text(`${message.from} ${formattedTime}: ${message.text}`);

  $('#messages').append(li);
})

socket.on('newLocationMessage', message => {
  const formattedTime = moment(message.createdAt).format('h:mm a')
  const li = $('<li></li>');
  const a = $('<a target="_blank">My current location</a>')

  li.text(`${message.from} ${formattedTime}: `);
  a.attr('href', message.url);

  li.append(a);
  $('#messages').append(li);
});

$('#message-form').on('submit', e => {
  e.preventDefault();

  const messageTextBox = $('[name=message]');

  socket.emit('createMessage', {
    from: 'user',
    text: messageTextBox.val()
  }, () => {
   messageTextBox.val('');
  });
});

const locationBtn = $('#send-location');

locationBtn.on('click', () => {
  if(!navigator.geolocation) {
    return alert('Geolocation not supported by your browser');
  }

  locationBtn.attr('disabled', 'disabled').text('Sending location...');

  navigator.geolocation.getCurrentPosition(position => {
    locationBtn.removeAttr('disabled').text('Send location');
    socket.emit('createLocationMessage', {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude
    });
  }, error => {
    locationBtn.removeAttr('disabled').text('Send location');;
    alert('Unable to fetch location.');
  });
});