const socket = io();

function scrollToButton() {
  const messages = $('#messages');
  const newMessage = messages.children('li:last-child');
  const clientHeight = messages.prop('clientHeight');
  const scrollTop = messages.prop('scrollTop');
  const scrollHeight = messages.prop('scrollHeight');
  const newMessageHeight = newMessage.innerHeight();
  const lastMessageHeight = newMessage.prev().innerHeight();

  if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
    messages.scrollTop(scrollHeight);
  }
}

socket.on('connect', () => {
  const params = $.deparam(window.location.search);

  socket.emit('join', params, function(err) {
    if (err) {
      alert(err);
      return window.location.href = '/';
    }

    console.log('No error');
  });
});

socket.on('disconnect', () => {
  console.log('disconnected from server');
})

socket.on('updateUserList', users => {
  const ol = $('<ol></ol>');

  users.forEach(user => {
    ol.append($('<li></li>').text(user));
  });

  $('#users').html(ol);
})

socket.on('newMessage', message => {
  const formattedTime = moment(message.createdAt).format('h:mm a');
  const template =  $('#messageTemplate').html();
  const html = Mustache.render(template, {
    text: message.text,
    from: message.from,
    createdAt: formattedTime
  });

  $('#messages').append(html);
  scrollToButton();
})

socket.on('newLocationMessage', message => {
  const formattedTime = moment(message.createdAt).format('h:mm a');
  const template = $('#locationMessageTemplate').html();
  const html = Mustache.render(template, {
    from: message.from,
    url: message.url,
    createdAt: formattedTime
  });

  $('#messages').append(html);
  scrollToButton();
});

$('#message-form').on('submit', e => {
  e.preventDefault();

  const messageTextBox = $('[name=message]');

  socket.emit('createMessage', {
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