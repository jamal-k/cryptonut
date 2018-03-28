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
    res.send("NOT AUTHET");
    return;
  }

  /* Make sure user, for which wallets are being retrieved, actually exists */
  User.findOne({username: req.params.username}, (err, user) => {

    if(!user){ res.status(500).send("findWalletByUserID() : No user exists for this wallet."); return; }
    else if(err){ console.log(err); return; }

    /* Find and send all the wallets for this user */
    Wallet.find({user : user._id}, (err, all_wallets) => {

      if(!all_wallets){ res.status(500).send("findWalletByUserID() : No wallets exists for this wallet."); return; }
      else if(err){ console.log(err); return; }

      if (all_wallets) {
        res.status(200).json(all_wallets);
      }
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

*/
router.post("/", function addWallet (req, res){
  console.log('addWallet() : ', req.body);

  /* Make sure user, for which wallet is being added, actually exists */
  User.findOne({username: req.body.username}, (err, user) => {

      if(!user){ res.send("500: addWallet() : No user exists for this wallet."); return; }
      else if(err){ console.log(err); return; }

      /* Add wallet if it doesn't already exist */
      Wallet.findOne({name: req.body.name, user: user._id}, (err, wallet) => {

        if(wallet){ res.send("500: addWallet() : The " + req.body.name + " wallet already exists for this user."); return; }
        else if(err){ console.log(err); return; }

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
  amount: the amount to update the wallet to


*/
router.post("/update", function updateWalletAmount (req, res) {
  console.log('updateWalletAmount()');

  /* Check if user exists */
  User.findOne({username: req.body.userID}, (err, user) => {

    if(!user){ res.send("500: updateWalletAmount() : No user exists for this wallet."); return; }
    else if(err){ console.log(err); return; }

    /* Check if wallet being updated exists */
    Wallet.findOne({user: user._id, name: req.body.name}, (err, w) => {

      if(!w){ res.send("500: updateWalletAmount() : No such wallet exists."); return; }
      else if(err){ console.log(err); return; }

      /* Update wallet amount and save */
      w.amount = req.body.amount;
      w.save((err) =>{
        if(err){ console.log(err); return; }

        res.send("200: wallet updated");
      });

    });

  });

});

module.exports = router
