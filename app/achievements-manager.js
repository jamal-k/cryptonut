const User = require('./models/user-model');
const BuyCoinsAch = require('./models/achievements/buy-coins-ach-model');
const Achievement = require('./models/achievement-model');

module.exports.createUserAchievements = (username) => {

  var achievements = [];

  /** [Buy 2 coins] Achievement **/
  var bca1 = new BuyCoinsAch({
    name: "Nutty Investor",
    description: "Buy 3 different coins",
    progress: "0/3",
    username: username,
    target_coins: "3"
  });

  achievements.push(bca1);
  BuyCoinsAch.findOne({name: bca1.name, username: bca1.username}, (err, bca) => {
    if(!bca){
      bca1.save((err) =>{ if(err){ console.log(err); return; } })
    }
  });
  /** END **/

  /** [Buy 10 coins] Achievement **/
  var bca2 = new BuyCoinsAch({
    name: "Nutter Investor",
    description: "Buy 10 different coins",
    progress: "0/10",
    username: username,
    target_coins: "10"
  });

  achievements.push(bca2);
  BuyCoinsAch.findOne({name: bca2.name, username: bca2.username}, (err, bca) => {
    if(!bca){
      bca2.save((err) =>{ if(err){ console.log(err); return; } })
    }
  });
  /** END **/


  /* Create and save an achievement for each of the individual achievements */
  achievements.forEach((a) => {

    var ach = new Achievement({
      name: a.name,
      description: a.description,
      progress: a.progress,
      username: a.username,
      achievement_id: a._id
    });

    Achievement.findOne({name: ach.name, username: ach.username}, (err, ach1) => {
      if(!ach1){
        ach.save((err) =>{ if(err){ console.log(err); return; } })
      }
    });

  });
}

/**
  Updates and checks all the "Buy Coins" achievements for a user.
*/
module.exports.updateCheckBuyCoinsAchs = (username) => {

  /* Get all Buy Coin Achievements (BCAs) */
  BuyCoinsAch.find({username: username}, (err, bcas) => {

    /* For each BCA */
    bcas.forEach((a) => {

      /* Update the amount */
      BuyCoinsAch.updateAch(username, true, a.target_coins, (completed, bca) => {

        /* Update the main achievement */
        Achievement.findOne({username: username, achievement_id: bca._id}, (err, ach) => {
          ach.progress = bca.progress

          ach.save((err) => {
            if(err){ console.log(err); return; }

            /* If it has been completed, then send an alert */
            if(completed && !bca.notified){

              clients.forEach((s) => {
                s.emit("achievement", {msg: "completed", name: ach.name});
                console.log("notified: ", clients.length)

                bca.notified = true;
                bca.save();

              });
            }

          });

        });
      });
    });
  });
}

function enrollAllAchs(){
  User.find({}, (err, users) => {
    console.log("ENROLLING");
    users.forEach(function (u) {
      module.exports.createUserAchievements(u.username);
    });
  });
}

enrollAllAchs();
