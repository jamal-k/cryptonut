var express = require('express');
var router = express.Router();

const Wallet = require('../models/wallet-model');
const User = require('../models/user-model');


router.get("/:username", function findWalletsByUserID (req, res) {
  console.log('findWalletByUserID');

  /* Make sure user, for which wallets are being retrieved, actually exists */
  User.findOne({username: req.params.username}, (err, user) => {
    if(!user){
      res.send("500: No user exists for this wallet.");
      return;
    }

    /* Find and send all the wallets for this user */
    Wallet.find({user : user._id}, (err, all_wallets) => {
      if(!all_wallets){
        res.send("500: No wallets exists for this wallet.");
        return;
      }
      else if(err){ res.send("500: An error occurred while searching for wallets: " + err); return; }

      if (all_wallets) {
        res.json(all_wallets);
      }
    });

  });

});

router.post("/", function addWallet (req, res){
  console.log('addWallet: ', req.body);

  /* Make sure user, for which wallet is being added, actually exists */
  User.findOne({username: req.body.username}, (err, user) => {
      if(!user){
        res.send("500: No user exists for this wallet.");
        return;
      }
      else if(err){ res.send("500: An error occurred while adding this wallet: " + err); return; }

      /* Add wallet if it doesn't already exist */
      Wallet.findOne({name: req.body.name, user: user._id}, (err, wallet) => {
        if(wallet){
          res.send("500: The " + req.body.name + " wallet already exists for this user.");
          return;
        }
        else if(err){ res.send("500: An error occurred while adding this wallet: " + err); return; }

        /* Create new wallet */
        var w = new Wallet({
          name: req.body.name,
          amount: req.body.amount,
          user: user._id
        });

        /* Save wallet in database */
        w.save((err) => {
          if(err){
            res.send("500: Wallet not added with error: " + err);
            return;
          }

          res.send("Wallet added");
        });

      });

  });
});

router.put("/:name/:username", function updateWalletAmount (req, res) {
  console.log('addWallet');

  User.find({username: req.params.userID}, (err, user) => {

    Wallet.findOne({user: user._id, name: req.params.name}, (err, w) => {
      if (err) throw err;

      w.amount = req.body.amount;
      w.save((err) =>{
        if (err) throw err;

        res.send("Wallet amount updated");
      });

    });

  }).limit(1);

});

module.exports = router
