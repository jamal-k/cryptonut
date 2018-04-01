const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const db = require('../db-connection');

/**
 * Note that the database was loaded with data from a JSON file into a
 * collection called courses.
 */
const buyCoinsAchSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  progress: {
    type: String,
    required: true
  },
  completed: {
    type: Boolean,
    required: true,
    default: false
  },
  username: {
    type: String,
    required: true
  },
  current_coins: {
    type: String,
    required: true,
    default: "0"
  },
  target_coins: {
    type: String,
    required: true
  }
});

/**
  Updates the achievment for the given username by increasing/decreasing the
  current_coins using the given coins. The achievement that is updated is
  identified using target_coins.

  @param username -  the username of the user's achievement to update
  @param increase - whether to increase or decrease the current_coins (amount: 1)
  @param target_coins - the achievement for which to update the coins
*/
buyCoinsAchSchema.statics.updateAch = function (username, increase, target_coins, callback) {

  BuyCoinsAch.findOne({username: username, target_coins: target_coins}, (err, bca) => {

    if(!bca) { console.log("No such buyCoinsAch exists"); return; }
    if(err){ console.log(err); return; }

    var new_current_coins = (increase == true) ? Number(bca.current_coins) + 1 : Number(bca.current_coins) - 1;

    if(new_current_coins < 0){
      new_current_coins = 0;
    }

    bca.current_coins = new_current_coins;
    bca.progress = new_current_coins + "/" + bca.target_coins;
    bca.completed = (Number(new_current_coins) >= Number(bca.target_coins)) ? true : false;
    
    bca.save((err) => {
      if(err){ console.log(err); return; }

      callback();
    })

  });
}

/**
  Checks if an achievement has been completed. The achievement that is checked
  is identified using target_coins.

  @param username -  the username of the user's achievement to update
  @param target_coins - the achievement for which to update the coins
  @param callback - the function to call to inform of the status of the achievment
*/
buyCoinsAchSchema.statics.checkAch = function (username, target_coins, callback) {

  BuyCoinsAch.findOne({username: username, target_coins: target_coins}, (err, bca) => {

    if(!bca) { console.log("No such buyCoinsAch exists"); return; }
    if(err){ console.log(err); return; }

    callback(bca.completed, bca);

  });
}

var BuyCoinsAch = mongoose.model('BuyCoinsAch', buyCoinsAchSchema);
module.exports = BuyCoinsAch;
