const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const db = require('../db-connection');
const User = require('../user-model');
const Wallet = require('../wallet-model');

/**
 * Note that the database was loaded with data from a JSON file into a
 * collection called courses.
 */
const valueChaSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  winner: {
    type: Boolean,
    required: false
  },
  progress: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true
  },
  current_amount: {
    type: String,
    required: true,
    default: "0"
  },
  wallet_name: {
    type: String,
    required: false,
    default: ""
  },
  wallet_currency: {
    type: String,
    required: true
  }
});

valueChaSchema.pre('save', function(next) {

  User.findOne({username: this.username}, (err, user) => {
    if(user){

      var wallet_name = this.name.replace(/\s+/, "")  + "[" + this.wallet_currency + "]"
      this.wallet_name = wallet_name;
      console.log("testing against", wallet_name)

      Wallet.findOne({user: user._id, name: wallet_name}, (err, wallet) => {

        if(!wallet){
          console.log("NOT FOUND WALLET")
          var w = new Wallet({
            name: wallet_name,
            amount: this.current_amount,
            user: user._id,
            challenge_currency: this.wallet_currency
          });

          w.save((err) => {
            if(err) {console.log("pre valuecha(): ", err)}

            next();
          })
        }
        else{
          console.log("FOUND WALLET")
          next();
        }

      });

    }
    else{
      next();
    }
  });

});

/**
  Updates the achievment for the given username by increasing/decreasing the
  current_coins using the given coins. The achievement that is updated is
  identified using target_coins.

  @param username -  the username of the user's challenge to update
  @param increase - whether to increase or decrease the target_wallet (by amount)
  @param wallet_name - the name of the target wallet
  @param amount - the amount to increase the wallet by
*/
valueChaSchema.statics.updateCha = function (username, wallet_name, callback) {

  User.findOne({username: username}, (err, user) => {
    if(!user){ console.log("updateCha() 1: User doesn't exist"); return; }
    if(err){ console.log("updateCha() 2: ", err); return; }

    ValueCha.findOne({username: username, wallet_name: wallet_name}, (err, vc) => {

      if(!vc){ console.log("updateCha() 3: Wallet doesn't exist"); return; }
      if(err){ console.log("updateCha() 4: ", err); return; }

      Wallet.findOne({user: user._id, name: wallet_name}, (err, wallet) => {
        if(!wallet){ console.log("updateCha() 5: Wallet doesn't exist"); return; }
        if(err){ console.log("updateCha() 6: ", err); return; }

        vc.current_amount = wallet.amount;
        vc.progress = "$" + wallet.amount;

        vc.save((err) => {
          if(err){ console.log(err); return; }

          callback(vc);
        });

      });

    });

  });


}

/**
  Sets the winner of the challenge (top on the leaderboard)

  @param wallet_name - the wallet name for which to set a winner
  @param callback - the function to call to inform of the winner
*/
valueChaSchema.statics.setWinner = function (wallet_name, callback) {

  ValueCha.find({wallet_name: wallet_name}, null, {sort: {current_amount: 1}}, (err, vcs) => {

    if(!vcs) { console.log("No ValueCha exists"); return; }
    if(err){ console.log(err); return; }

    vcs[0].winner = true;

    vcs[0].save((err) => {
      if(err){ console.log(err); return; }

      callback(vcs[0].winner, vcs[0]);
    })



  });
}

var ValueCha = mongoose.model('ValueCha', valueChaSchema);
module.exports = ValueCha;
