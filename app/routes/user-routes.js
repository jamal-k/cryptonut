var express = require('express');
var router = express.Router();
var axios = require('axios');

const User = require('../models/user-model');

/**
Creates the user and adds it to the database.

TYPE: POST
ENDPOINT: /user/

BODY:
  email: email of the user to create
  username: username of the user to create
  password: password of the user to create

*/
router.post('/', function addUser(req, res) {
  console.log("addUser() : ", req.body);

  /* Add user if one doesn't already exist */
  User.findOne({email: req.body.email}, (err, email) => {

    if(email){ res.send({msg: "500: addUser() : email already exists"}); return; }
    else if(err){ console.log(err); return; }

    User.findOne({username: req.body.username}, (err, user) => {

      if(user){ res.send({msg: "500: addUser() : username already exists"}); return; }
      else if(err){ console.log(err); return; }


      /* Create a new user */
      var u = new User({
        email: req.body.email,
        username: req.body.username,
        password: req.body.password
      });

      /* Save user to database */
      u.save((err) => {
        if(err){ console.log(err); return; }

        req.session.userID = u._id

        /* Create a default USD Wallet */
        axios.post("http://localhost:3000/wallet/", {name: "USD", amount: "10000", username: u.username})
          .then(res => {
            console.log(res.data);
          });

        res.send({msg: "200: success", username: u.username});
      });

    });
  });
});

/**
Logs the user in by authenticating with DB and then creating a session

TYPE: POST
ENDPOINT: /user/login

BODY:
  username: username of the user to logged in
  password: password of the user to log in

*/
router.post("/login", function loginUser(req, res){

  /* Check if username exists in db */
  User.authenticate(req.body.username, req.body.password, (err, user) => {

    if(user){
      /* Create session for user upon successful login */
      req.session.userID = user._id
      res.send({msg: "200: login success", username: user.username});
    }
    else{
      res.send({msg: "500: login failed"});
    }

  });
});

/**
Logs the user out by deleting the session.

TYPE: GET
ENDPOINT: /user/logout
*/
router.get("/logout", function loginUser(req, res){

  /* Make sure the session exists */
  if(req.session){

      /* Destroy the user session */
      req.session.destroy((err) => {

        if(err){
          res.send({msg: "500: logout failed"});
        }
        else{
          res.send({msg: "200: logout success"});
        }

      });

  }
});

/**
Checks if the user is already logged in.

TYPE: GET
ENDPOINT: /user/checkauth
*/
router.get("/checkauth", function checkAuth(req, res){

  if(req.session.userID){
    res.send("auth");
  }
  else{
    res.send("not-auth");
  }

});

module.exports = router
