const User = require('./models/user-model');
const BuyCoinsAch = require('./models/achievements/buy-coins-ach-model');
const Achievement = require('./models/achievement-model');

module.exports.createUserAchievements = (username) => {

  var achievements = [];

  var bca1 = new BuyCoinsAch({
    name: "Nutty Investor",
    description: "Buy 2 different coins",
    progress: "0/2",
    username: username,
    target_coins: "2"
  });

  achievements.push(bca1);
  BuyCoinsAch.findOne({name: bca1.name, username: bca1.username}, (err, bca) => {
    if(!bca){
      bca1.save((err) =>{ if(err){ console.log(err); return; } })
    }
  })


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
      BuyCoinsAch.updateAch(username, true, a.target_coins, () => {

        /* Get the newly updated BCA */
        BuyCoinsAch.checkAch(username, a.target_coins, (completed, bca) => {

          /* Update the main achievement */
          Achievement.findOne({username: username, achievement_id: bca._id}, (err, ach) => {
            ach.progress = bca.progress

            ach.save((err) => {
              if(err){ console.log(err); return; }

              /* If it has been completed, then send an alert */
              if(completed){
                clients.forEach((s) => {
                  s.emit("achievement", {msg: "completed", name: ach.name});
                });
              }

            });
          });
        });
      });
    });
  });
}
