var express = require('express');
let User = require("../models/User");
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('users');
});

router.get('/register', function(req, res, next) {
  res.render('register');
});

router.get('/login', function(req, res, next) {
  res.render('login');
});

router.post('/register', function(req, res, next) {
  User.create(req.body, (err, user)=>{
    if (err) return next(err);
    res.render('users');
  });
});

router.post('/login', function(req, res, next) {
  let {email, password} = req.body;

  if( !email || !password ) {
    return res.redirect("/users/login");
  }

  User.findOne({ email }, (err, user)=>{
    if (err) return next(err);

    if( !user ) return res.redirect("/users/login");

    user.verifypassword(password, (err, result)=>{
      if(err) return next(err);
      if(result) {
        req.session.userId = user._id
        return res.redirect("/users/dashBoard");
      } else {
        return res.redirect("/users/login")
      }
    });
  });
});

router.get("/dashBoard", (req,res, next)=>{
  res.render("dashboard");
})

module.exports = router;
