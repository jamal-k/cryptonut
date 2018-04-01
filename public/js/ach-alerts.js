var socket = io();
socket.on('achievement', function(data) {
        console.log('The server has a message for you: ' + data.msg);
});
