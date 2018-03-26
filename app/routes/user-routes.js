var express = require('express');
var router = express.Router();

const User = require('../models/user-model');

/**
Return information about the user.
*/
router.get('/:username', function getUserByUsername (req, res) {

  /* Find the user and return all his information */
  User.findOne({username: req.params.username}, (err, user) => {
    if(user){
      res.json(user);
    }
  });
});

/**
Add the user to the database.
*/
router.post('/', function addUser(req, res) {
  console.log("addUser: ", req.body);

  /* Add user if one doesn't already exist */
  User.findOne({email: req.body.email}, (err, email) => {
    if(email){
      res.send("500: email already exists");
      return;
    }

    User.findOne({username: req.body.username}, (err, user) => {
      if(user){
        res.send("500: username already exists");
        return;
      }


      /* Create a new user */
      var u = new User({
        email: req.body.email,
        username: req.body.username,
        password: req.body.password
      });

      /* Save user to database */
      u.save((err) => {
        if (err){
          console.log("500: user not added with error: " + err)
          res.send("500: user not added with error: " + err);
          return;
        }

        req.session.userID = u._id
        res.send("200: success");
      });

    });
  });
});


router.post("/login", function loginUser(req, res){
  console.log("HEY:", req.body);

  /* Check if username exists in db */
  User.authenticate(req.body.username, req.body.password, (err, user) => {
    if(user){
      /* Create session for user upon successful login */
      req.session.userID = user._id
      res.send("200: login success");
    }
    else{
      res.send("500: login failed");
    }

  });
});

router.post("/logout", function loginUser(req, res){

  /* Make sure the session exists */
  if(req.session){

    /* Make sure the user for which we are loging out exists */
    User.findOne({username: req.body.username}, (err, user) => {
      if(user){

        /* Destroy the user session */
        req.session.destroy((err) => {
          if(err){
            res.send("500: logout failed");
          }
          else{
            res.send("200: logout success");
          }
        });

      }
      else{
        res.send("500: logout failed");
      }

    });
  }
});

module.exports = router
