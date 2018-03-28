var express = require('express');
var router = express.Router();
var axios = require('axios');


const Wallet = require('../models/wallet-model');
const User = require('../models/user-model');

/**
Trades two coins of the user.

TYPE: POST
ENDPOINT: /trade/username=

PARAMETERS:
  username: username of the user's coins to trade

BODY:
  send_coin: symbol of the wallet from which we are sending money
  rec_coin: symbol of the wallet which will be receiving money
  send_amount: the amount of coins we are trading

*/
router.post("/:username", function tradeCoins (req, res) {
  console.log('tradeCoins()');

  /* Make sure user, for which wallets are being retrieved, actually exists */
  User.findOne({username: req.params.username}, (err, user) => {

    if(!user){ res.send("500: tradeCoins() : No user exists for this trade to happen."); return; }
    else if(err){ console.log(err); return; }

    /* Check if user has the wallet for the coin they are sending */
    Wallet.findOne({user : user._id}, {name: req.body.send_coin}, (err, send_wallet) => {

      /* If the user doesn't, then send an error */
      if(!send_wallet){ res.send("500: tradeCoins() : " + req.body.send_coin + " wallet does not exist for this user."); return; }
      else if(err){ console.log(err); return; }

      /* If not enough coins in sending wallet, then return error */
      if(Number(send_wallet.amount) < Number(req.body.send_amount)){
        res.send("500: tradeCoins() : " + req.body.send_coin + " wallet does not have enough coins to send.");
        return;
      }

      /* Check if user has the wallet for the coin they are receiving */
      Wallet.findOne({user : user._id}, {name: req.body.rec_coin}, (err, rec_wallet) => {

        if(!rec_wallet){

          /* Create an empty wallet if wallet doesn't exist */
          createEmptyWallet(user.username, req.body.rec_coin, (add_response) => {

            if(add_response == "200: wallet added"){

              /* Commit to the trade since all tests have passed */
              commitTrade(user.username, send_wallet, rec_wallet, req.body.send_amount, (trade_resp) => {
                res.send(trade_resp);
              });

            }
            else{ res.send(add_response); return; }

          });

        }
        else if(err){ console.log(err); return; }

        /* Commit to the trade since the receiving wallet exists and all prev test pass */
        commitTrade(user.username, send_wallet, rec_wallet, req.body.send_amount, (trade_resp) => {
          res.send(trade_resp);
        });

      });

    });

  });

});

function createEmptyWallet(username, name, callback){
  axios.post("http://localhost:3000/wallet/", {name: name, amount: 0, username: username})
    .then(res => {
      callback(res.data);
  });
}

function commitTrade(username, send_wallet, rec_wallet, send_amnt, callback){

  /* New amount in sending wallet is it's current balance minus the sending amount */
  var new_amount = send_wallet.amount - send_amnt;

  /* Update the sending wallet's amount */
  axios.post("http://localhost:3000/wallet/update", {name: send_wallet.name, amount: new_amount, username: username})
    .then(res => {
      if(res.data == "200: wallet updated"){

        axios.get("https://min-api.cryptocompare.com/data/price?fsym=" + send_wallet.name + "&tsyms=" + rec_wallet.name)
          .then(res => {
            console.log("RESTP" + res.data)
          });
      }
  });
}

function commitTrade(send_wallet, rec_wallet){

    axios.get("https://min-api.cryptocompare.com/data/price?fsym=" + send_wallet + "&tsyms=" + rec_wallet)
      .then(res => {
        console.log(res.data[rec_wallet])
      });

}

commitTrade("BTC", "XRP");

module.exports = router
