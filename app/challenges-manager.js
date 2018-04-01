const User = require('./models/user-model');
const ValueCha = require('./models/challenges/value-challenge-model');
const Challenge = require('./models/challenge-model');



/**
  [ADMIN USAGE] Enrol the admin user to all challenges. Only used with admin user.
*/
module.exports.createUserChallenges = (username) => {

  var challenges = [];

  /** [10k Way] Challenge **/
  var vc1 = new ValueCha({
    name: "10k Way",
    description: "Everyone is given a 10k USD challenge wallet,<br/> " +
                  "the person with the highest valued wallet at the end of the week wins.",
    progress: "$10000",
    username: username,
    current_amount: "10000",
    wallet_name: "10kWay"
  });

  challenges.push(vc1);
  ValueCha.findOne({name: vc1.name, username: vc1.username}, (err, vc) => {
    if(!vc){
      vc1.save((err) =>{ if(err){ console.log(err); return; } })
    }
  });
  /** END **/


  /* Create and save a challenge for each of the individual challenges */
  challenges.forEach((a) => {

    var cha = new Challenge({
      name: a.name,
      description: a.description,
      progress: a.progress,
      username: a.username,
      challenge_id: a._id
    });

    Challenge.findOne({name: cha.name, username: cha.username}, (err, cha1) => {
      if(!cha1){
        cha.save((err) =>{ if(err){ console.log(err); return; } })
      }
    });

  });

}

/**
  Update the ValueChallenge of a given user.
*/
module.exports.updateValueCha = (username, wallet_name) => {

  ValueCha.findOne({username: username, name: wallet_name}, (err, wallet) => {
    if(!wallet){ console.log("updateValueCha() 1: Wallet doesn't exist"); return; }
    if(err){ console.log("updateValueCha() 2: ", err); return; }

    ValueCha.updateCha(username, wallet_name, (vc) => {

      Challenge.findOne({username: vc.username, challenge_id: vc._id}, (err, cha) => {

        cha.progress = vc.progress;

        cha.save((err) => console.log("updateValueCha() 3: ", err));
      });

    });

  });

}




/******************************************************************************/
/******************************************************************************/
/******************************************************************************/
/******************* SPECIFIC CHALLENGE START FUNCTIONS ***********************/
/******************************************************************************/
/******************************************************************************/
/******************************************************************************/



/**
  Starts the given challenge for the given user.
*/
module.exports.startChallenge = (name, username, callback) => {

  switch (name) {
    case "10k Way":
      startValueCha1Challenge(username, (resp) => {
        callback(resp);
      });
      break;
    default:
      console.log("NOT EXI");
      callback("500");
      break;
  }

}

/**
  Starts the 10k Way Challenge for the given user.
*/
function startValueCha1Challenge(username, callback){

  /** [10k Way] Challenge **/
  var vc1 = new ValueCha({
    name: "10k Way",
    description: "Everyone is given a 10k USD challenge wallet, " +
                  "the person with the highest valued wallet at the end of the week wins.",
    progress: "$10000",
    username: username,
    current_amount: "10000",
    wallet_name: "10kWay"
  });


  ValueCha.findOne({name: vc1.name, username: vc1.username}, (err, vc) => {
    if(!vc){
      vc1.save((err) =>{
        if(err){ console.log(err); callback("500"); return; }

        var cha = new Challenge({
          name: vc1.name,
          description: vc1.description,
          progress: vc1.progress,
          username: vc1.username,
          challenge_id: vc1._id
        });

        Challenge.findOne({name: cha.name, username: cha.username}, (err, cha1) => {
          if(!cha1){
            cha.save((err) =>{
              if(err){ console.log(err); callback("500"); return; }
              callback("200");
            });
          }
          else{
            callback("500");
          }
        });

      });
    }
    else{
      callback("500");
    }
  });

}

module.exports.createUserChallenges("admin");
