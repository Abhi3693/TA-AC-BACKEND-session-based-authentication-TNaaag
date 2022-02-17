var express = require('express');
let User = require("../models/User");
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  console.log(req.session,"=========");
  res.render('users');
});

router.get('/register', function(req, res, next) {
  let err = req.flash("error")[0];
  res.render('register', {err});
});

router.get('/login', function(req, res, next) {
  let err = req.flash("error")[0];
  res.render('login', {err});
});

router.post('/register', function(req, res, next) {
  User.create(req.body, (err, user)=>{
    if (err) {
      req.flash("error", "Validation failed");
      return res.redirect("/users/register")
    } else {
      res.render('users', {err});
    }
  });
});

router.post('/login', function(req, res, next) {
  let {email, password} = req.body;

  if( !email || !password ) {
    req.flash("error", "Email/password is required");
    return res.redirect("/users/login");
  }

  User.findOne({ email }, (err, user)=>{
    if (err) return next(err);

    if( !user ) {
      req.flash("error", "email is not registerd");
      return res.redirect("/users/login");
    } else {
      user.verifypassword(password, (err, result)=>{
        if(err) return next(err);
        if(result) {
          req.session.userId = user._id
          return res.redirect("/users/dashBoard");
        } else {
          req.flash("error", "Enter valid password");
          return res.redirect("/users/login")
        }
      });
    }
  });
});

router.get("/dashBoard", (req,res, next)=>{
  res.render("dashboard");
});

router.get("/logout", (req,res,next)=>{
  req.session.destroy();
  res.clearCookie("connect.sid")
  res.redirect("/users/login");
});

module.exports = router;