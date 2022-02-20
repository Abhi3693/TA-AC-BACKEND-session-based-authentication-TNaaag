var express = require('express');
const User = require('../models/User');
const Bag = require('../models/Bag');
var router = express.Router();

/* GET users listing. */
router.get('/login', function(req, res, next) {
  let err = req.flash("error");
  res.render('login',{err});
});

router.get('/register', function(req, res, next) {
  let err = req.flash("error");
  res.render('register',{err});
});

router.post("/register", (req,res,next)=>{
  // console.log(req.body);
  User.create(req.body, (err, user)=>{
    if(err) {
      if(err.code === 11000) {
        req.flash("error", " Unique Email is required");
        res.redirect("/users/register");
      } else {
        req.flash("error", "Validation Error username,email, password, role are required");
        res.redirect("/users/register");
      }
    } else {
      res.redirect("/users/login");
    }
  });
});

router.post("/login", (req,res,next)=>{
  let {email,password, role} = req.body;

  if(!email && !password) {
    req.flash("error", "Email/password is required");
    res.redirect("/users/login");
  } else {
    User.findOne({email}, (err, user)=>{
      if(err) {
        console.log(err, "=========");
        req.flash("error", err);
        res.redirect("/users/login");
      } else {
        if(!user) {
          req.flash("error", "This is not registerd email");
          res.redirect("/users/login");
        } else {
          user.verifypassword(password, role, (err,result)=>{
            if(err) return next(err);
            if(result){
              console.log(req.session, "in login=========");
              req.session.role = user.role;
              req.session.userId = user._id;
              res.redirect("/products/dashboard");
            } else {
              req.flash("error", "Enter valid password");
              res.redirect("/users/login");
            }
          });
        }
      }
    });
  }
});

router.get("/logout", (req,res,next)=>{
  req.session.destroy();
  res.clearCookie("connect.sid");
  res.redirect("/users/login");
});

router.get("/:id/addBag", (req,res,next)=>{
  if(req.session.userId) {
    let userId = req.session.userId;
    let productId = req.params.id;
  
    User.findByIdAndUpdate(userId, { $push : { bag : productId}},{new:true} ,(err,user)=>{
      if(err) return next(err);
      res.redirect("/products/" + productId);
    });
  } else {
    req.flash("error", "To add Product in bag needs login first");
    res.redirect("/users/login");
  }
});

router.get("/myBag", (req,res,next)=>{
  if(req.session.userId) {
    let userId = req.session.userId;
    User.findById(userId).populate("bag").exec((err, user)=>{
      if(err) return next(err);
      res.render("myBag", {user});
    });
  } else {
    req.flash("error", "To see bag, needs login first");
    res.redirect("/users/login");
  }
})


module.exports = router;
