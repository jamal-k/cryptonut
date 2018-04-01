const express = require('express');
var mongoose = require('mongoose');
const app = express();
const bodyParser = require('body-parser');
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));
var session = require('express-session');

clients = []

//use sessions for tracking logins
app.use(session({
  secret: 'clockernow',
  resave: true,
  saveUninitialized: false
}));

app.use(express.static('public'));

/**** User Routes ****/
const users = require('./app/routes/user-routes');
app.use("/user", users);

/**** Wallet Routes ****/
const wallets = require('./app/routes/wallet-routes');
app.use("/wallet", wallets)

/**** Trade Routes ****/
const trade = require('./app/routes/trade-routes');
app.use("/trade", trade)

/**** Achievement Routes ****/
const achievement = require('./app/routes/achievement-routes');
app.use("/achievement", achievement);

/**** Challenge Routes ****/
const challenge = require('./app/routes/challenge-routes');
app.use("/challenge", challenge);

/** Setup socket.io **/
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);



io.on('connection', function (socket) {
  console.log('A client is connected!');
  clients.push(socket)

  socket.on('disconnect', function () {
    console.log('A client is disconnected!');
    var i = clients.indexOf(socket);
    clients.splice(i, 1);
  });

});

/* Start Server */
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
