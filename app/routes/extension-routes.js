var express = require('express');
var router = express.Router();
var axios = require('axios');

const User = require('../models/user-model');
const Wallet = require('../models/wallet-model');


/**
Returns a list of coins form the coinmarket API the user owns.

TYPE: GET
ENDPOINT: extension/coins/username=

PARAMETERS:
  username: the user's owned coins to retrieve

RESPONSE:
  coins_owned: a list of coins
*/
router.get("/coins/:username", function getCoins (req, res) {
  console.log('getCoins()');

  if(!req.session.userID){
    res.status(500).send({msg: "NOT AUTHORIZED"});
    return;
  }

  /* Make sure user exists */
  User.findOne({username: req.params.username}, (err, user) => {
    if(!user){ res.status(500).send({msg: "User does not exist."}); return; }
    if(err){ console.log("getCoins() 1: ", err); return; }

    Wallet.find({user: user._id}, (err, wallets) => {
      if(!wallets){ res.status(500).send({msg: "No wallets exist."}); return; }
      if(err){ console.log("getCoins() 2: ", err); return; }

      axios.get("https://api.coinmarketcap.com/v1/ticker/")
        .then(resp => {

          /* Add all the challenge wallet coins */
          wallets.forEach(function(w){
            if(w.challenge_currency != ""){
              var new_coin = {symbol: w.name}
              resp.data.unshift(new_coin);
            }
          });

          res.send(resp.data);
      });



    })



  });
});

module.exports = router
