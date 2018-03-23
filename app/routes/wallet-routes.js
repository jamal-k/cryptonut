const Wallet = require('../models/wallet-model');
const User = require('../models/user-model');

exports.findWalletsByUserID = (req, res) => {
  console.log('findWalletByUserID');

  User.find({username: req.params.username}, (err, user) => {
    if(!user){
      res.send("500: No user exists for this wallet.");
      return;
    }

    Wallet.find({user : user._id}, (err, all_wallets) => {
      if(!user){
        res.send("500: No user exists for this wallet.");
        return;
      }

      if (all_wallets) {
        res.json(all_wallets);
      }
    });

  }).limit(1);

};

exports.addWallet = (req, res) => {
  console.log('addWallet: ', req.body);

  User.find({username: req.body.username}, (err, user) => {
      if(!user){
        res.send("500: No user exists for this wallet.");
        return;
      }
      else if(err){
        res.send("500: No user exists for this wallet with error: " + err);
        return;
      }

      var w = new Wallet({
        name: req.body.name,
        amount: req.body.amount,
        user: user._id
      });

      w.save((err) => {
        if(err){
          res.send("500: Wallet not added with error: " + err);
          return;
        }

        res.send("Wallet added");
      });

    }).limit(1);
};

exports.updateWalletAmount = (req, res) => {
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

};
