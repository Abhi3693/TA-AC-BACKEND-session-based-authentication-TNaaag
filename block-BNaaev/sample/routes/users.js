var express = require('express');
var mongoose = require('mongoose');
let bcrypt = require("bcrypt");
let User = require("../models/User");

var router = express.Router();

/* GET users listing. */
router.get('/register', function(req, res, next) {
  res.render('addUser');
});

router.post('/register', function(req, res, next) {
  User.create(req.body, (err, user)=>{
    if(err) return next(err);
    res.send(user);
  })
});

module.exports = router;
