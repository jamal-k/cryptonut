var express = require('express');
var router = express.Router();

const Wallet = require('../models/wallet-model');
const User = require('../models/user-model');

/**
Retrieves all the wallets for a specific user.

TYPE: GET
ENDPOINT: /wallet/username=

PARAMETERS:
  username: username of the user's wallets to retrieve

*/
router.get("/:username", function findWalletsByUserID (req, res) {
  console.log('findWalletByUserID()');

  if(!req.session.userID){
    res.status(500).send("NOT AUTHORIZED");
    return;
  }

  /* Make sure user, for which wallets are being retrieved, actually exists */
  User.findOne({username: req.params.username}, (err, user) => {

    if(!user){ res.status(500).send("No such user exists."); return; }
    if(err){ console.log(err); return; }

    /* Find and send all the wallets for this user */
    Wallet.find({user : user._id}, (err, all_wallets) => {

      if(!all_wallets){ res.status(500).send("No wallets exists for this wallet."); return; }
      if(err){ console.log(err); return; }

      if (all_wallets) {
        res.status(200).json(all_wallets);
      }
    });

  });

});

/**
Retrieves specified wallet for the user.

TYPE: GET
ENDPOINT: /wallet/username=/wallet=

PARAMETERS:
  username: username of the user's wallet to retrieve
  wallet: the name of the wallet to retrieve

*/
router.get("/:username/:wallet", function findWalletByName (req, res) {
  console.log('findWalletByName()');

  if(!req.session.userID){
    res.status(500).send("NOT AUTHORIZED");
    return;
  }

  /* Make sure user, for which wallets are being retrieved, actually exists */
  User.findOne({username: req.params.username}, (err, user) => {

    if(!user){ res.status(500).send("No user exists for this wallet."); return; }
    if(err){ console.log(err); return; }

    /* Find and send all the wallets for this user */
    Wallet.findOne({user : user._id, name: req.params.wallet}, (err, wallet) => {

      if(!wallet){ res.status(500).send("Wallet does not exist."); return; }
      if(err){ console.log(err); return; }

      res.send(wallet);
    });

  });

});

/**
Adds a wallet to the database for a specific user.

TYPE: POST
ENDPOINT: /wallet/

BODY:
  username: username of the user to add wallet to
  name: name of the wallet being added
  secret_key: required to make calls to this api

*/
router.post("/", function addWallet (req, res){
  console.log('addWallet() : ', req.body);

  if(req.body.secret_key != "clock50boisonly"){
    req.status(500).send("Not authorized to use this API.")
  }

  /* Make sure user, for which wallet is being added, actually exists */
  User.findOne({username: req.body.username}, (err, user) => {

      if(!user){ res.status(500).send({msg: "No user exists for this wallet to be added."}); return; }
      if(err){ console.log(err); return; }

      /* Add wallet if it doesn't already exist */
      Wallet.findOne({name: req.body.name, user: user._id}, (err, wallet) => {

        if(wallet){ res.status(500).send({msg: "The " + req.body.name + " wallet already exists for this user."}); return; }
        if(err){ console.log(err); return; }

        /* Create new wallet */
        var w = new Wallet({
          name: req.body.name,
          amount: req.body.amount,
          user: user._id
        });

        /* Save wallet in database */
        w.save((err) => {
          if(err){ console.log(err); return; }

          res.send("200: wallet added");
        });

      });

  });
});

/**
Updates a user's specific wallet's amount.

TYPE: POST
ENDPOINT: /wallet/name=/username=

BODY:
  username: username of the user for which the wallet is being updated
  name: name of the wallet being updated
  amount: the amount to add (or subtract if negative) from the wallet
  secret_key: required to make calls to this api


*/
router.post("/update", function updateWalletAmount (req, res) {
  console.log('updateWalletAmount()');

  if(req.body.secret_key != "clock50boisonly"){
    req.status(500).send("Not authorized to use this API.")
  }

  /* Check if user exists */
  User.findOne({username: req.body.username}, (err, user) => {

    if(!user){ res.status(500).send({msg: "No user exists for this wallet to be updated."}); return; }
    if(err){ console.log(err); return; }

    /* Check if wallet being updated exists */
    Wallet.findOne({user: user._id, name: req.body.name}, (err, w) => {

      if(!w){ res.status(500).send({msg: "Wallet being updated doesn't exist."}); return; }
      if(err){ console.log(err); return; }

      /* If negative, then subtract from the current balance */
      if(req.body.negative == true){
        var new_amount = Number(w.amount) - Number(req.body.amount);
      }
      else{
        var new_amount = Number(w.amount) + Number(req.body.amount);
      }

      w.amount = new_amount;
      w.save((err) =>{
        if(err){ console.log(err); return; }

        res.send("200: wallet updated");
      });

    });

  });

});

module.exports = router
