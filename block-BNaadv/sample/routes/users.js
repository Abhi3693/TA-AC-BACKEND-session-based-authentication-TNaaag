var express = require('express');
let User = require("../model/User");
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/login', function(req, res, next) {
  let err = req.flash("error")[0];
  res.render("login", {err});
});

router.get('/register', function(req, res, next) {
  let err = req.flash("error");
  res.render("register", {err});
});

router.post('/register', function(req, res, next) {
  User.create(req.body, (err,user)=>{
    if(err) {
      if(err.code === 11000){
        req.flash("error", "email is not unique");
        return res.redirect("/users/register");
      } else {
        req.flash("error", "All Details of form is required");
        return res.redirect("/users/register");
      }
    } else {
      let err = req.flash("error");
       return res.render("login",{err});
    }
  });
});

router.post('/login', function(req, res, next) {

  let {email, password} = req.body;

  if(!email && !password) {
    req.flash("error", "Email/password is required");
    return res.redirect("/users/login");
  } else {
    User.findOne({ email }, (err, user)=>{
      if(err) {
      } else if(!user) {
        req.flash("error", "Email is not registerd");
        return res.redirect("/users/login");
      } else {
        user.verifypassword(password, (err, result)=>{
          if(err)  return next(err);
          if(!result){
            req.flash("error", "Enter valid password");
            res.redirect("/users/login");
          } else {
            req.session.userId = user._id;
            res.redirect("/users/dashboard");
          }
        });
      }
    });
  }
});

router.get("/dashboard", (req,res,next)=>{
  res.render("dashboard");
});

router.get("/logout", (req,res,next)=>{
  req.session.destroy();
  res.clearCookie("connect.sid");
  res.redirect("/users/login");
});

module.exports = router;
