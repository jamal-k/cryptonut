const express = require('express');
var mongoose = require('mongoose');
const app = express();
const bodyParser = require('body-parser');
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

app.use(express.static('public'));

/**** Wallet Routes ****/
const users = require('./app/routes/user-routes');

app.get('/user/:username', users.getUserByUsername);
app.post('/user', users.addUser);


/**** Wallet Routes ****/
const wallets = require('./app/routes/wallet-routes');

app.get('/wallet/:username', wallets.findWalletsByUserID);
app.post('/wallet/', wallets.addWallet);
app.put('/wallet/:name/:username', wallets.updateWalletAmount);

/* Start Server */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
