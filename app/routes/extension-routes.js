var express = require('express');
var router = express.Router();
var axios = require('axios');

const User = require('../models/user-model');


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

  

});

module.exports = router
