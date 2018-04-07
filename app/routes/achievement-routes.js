var express = require('express');
var router = express.Router();
var axios = require('axios');

const User = require('../models/user-model');
const Achievement = require('../models/achievement-model');


/**
Return a list of all achievements.

TYPE: GET

ENDPOINT: /achievement/username=

PARAMETERS:
  username: username of the user's achievements to get

RESPONSE:
  achievements: a list of achievements of the given user
*/
router.get("/:username", function getAchievements (req, res) {
  console.log('getAchievements()');

  if(!req.session.userID){
    res.status(500).send({msg: "NOT AUTHORIZED"});
    return;
  }

  /* Make sure user, for which wallets are being retrieved, actually exists */
  User.findOne({username: req.params.username}, (err, user) => {

    if(!user){ res.status(500).send({msg: "User does not exist for this trade to happen."}); return; }
    if(err){ console.log(err); return; }

    Achievement.find({username: req.params.username}, (err, achievements) => {
      if(!achievements){ res.status(500).send("No achievements exists for this user."); return; }
      if(err){ console.log(err); return; }

      if (achievements) {
        res.status(200).json(achievements);
      }

    });

  });

});

module.exports = router
