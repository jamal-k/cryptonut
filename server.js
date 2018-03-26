const express = require('express');
var mongoose = require('mongoose');
const app = express();
const bodyParser = require('body-parser');
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));
var session = require('express-session');

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

/* Start Server */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
