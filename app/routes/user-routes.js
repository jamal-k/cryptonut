const User = require('../models/user-model');

exports.getUserByUsername = (req, res) => {
  User.find({username: req.params.username}, (err, user) => {
    if(user){
      res.json(user);
    }
  }).limit(1);
};

exports.addUser = (req, res) => {

  User.find({username: req.params.username}, (err, user) => {
    if(user){
      res.send("500: User already exists");
      return;
    }

    var u = new User({
      name: req.body.name,
      username: req.body.username,
      password: req.body.password
    });

    u.save((err) => {
      if (err){
        res.send("500: User not added with error: " + err);
        return;
      }

      res.send("User added");
    });

  }).limit(1);
};
