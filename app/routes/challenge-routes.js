var express = require('express');
var router = express.Router();
var axios = require('axios');

const User = require('../models/user-model');
const Challenge = require('../models/challenge-model');
const ChallengesManager = require('../challenges-manager');


/**
Return a list of all challenges of a given name.

TYPE: GET
ENDPOINT: /challenge/name=

PARAMETERS:
  name: the unique name of the challenges to return

RESPONSE:
  achievements: a list of achievements of the given user
*/
router.get("/:name", function getChallenges (req, res) {
  console.log('getChallenges()');

  if(!req.session.userID){
    res.status(500).send({msg: "NOT AUTHORIZED"});
    return;
  }

  Challenge.find({name: req.params.name}, (err, chs) => {

    if(!chs){ res.status(500).send({msg: "No challenges exist with the given name."}); return; }
    if(err){ console.log(err); return; }

    if (chs) {
      res.status(200).json(chs);
    }

  });

});

/**
Return a list of all challenges

TYPE: GET
ENDPOINT: /challenge

RESPONSE:
  challenges: a list of challenges
*/
router.get("/", function getChallengsList (req, res) {
  console.log('getChallengsList()');

  if(!req.session.userID){
    res.status(500).send({msg: "NOT AUTHORIZED"});
    return;
  }

  Challenge.find({username: "admin"}, (err, challenges) => {
    if(!challenges){ res.status(500).send("No challenges exist"); return; }
    if(err){ console.log(err); return; }

    if (challenges) {
      res.status(200).json(challenges);
    }

  });

});

/**
Start  a given challenge for the user.

TYPE: POST
ENDPOINT: /challenge

BODY:
  username: the user for which to start the challenge
  name: the name of the challenge to start
*/
router.post("/", function startChallengeForUser (req, res) {
  console.log('startChallengeForUser(): ', req.body);

  //TODO: Make sure only the user who is logged in can start his own challenge
  if(!req.session.userID){
    res.status(500).send({msg: "NOT AUTHORIZED"});
    return;
  }

  User.findOne({username: req.body.username}, (err, user) => {
    if(!user){ res.status(500).send({msg: "User does not exist to start challenge."}); return; }
    if(err){ console.log("startChallengeForUser() 1: ", err); return; }

    console.log("FOIND USER")

    Challenge.findOne({username: user.username, name: req.body.name}, (err, challenge) => {
      if(err){ console.log("startChallengeForUser() 2: ", err); return; }

      if(challenge){
        res.status(500).send({msg: "User does not exist to start challenge."})
        console.log("exust ch")
      }
      else{
        ChallengesManager.startChallenge(req.body.name, user.username, (cm_resp) => {

          if(cm_resp == "200"){
            console.log("start")
            res.send({msg: "200: challenge started"});
          }
          else{
            console.log("failed")
            res.status(500).send({msg: "Failed to start challenge for user."});
          }

        });
      }

    });

  });

});

module.exports = router
