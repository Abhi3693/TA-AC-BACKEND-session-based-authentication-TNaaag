var express = require('express');
let Product = require("../models/Product");
let Comment = require("../models/Comment");
var router = express.Router();

/* GET home page. */

router.get("/dashboard", (req,res,next)=>{
  // console.log(req.session,"in dashboard=========");
  Product.find({}, (err,products)=>{
    if(err) return next(err);
    err = req.flash("error");
    res.render("dashboard", {products, err});
  });
  
});

router.get('/new', function(req, res, next) {
  if(req.session.role === 'admin' && req.session.userId) {
    res.render("addProduct");
  } else {
    req.flash("error", "Only adimin can add Product");
    res.redirect("/products/dashboard");
  }
});

router.post("/new", (req,res,next)=>{
  Product.create(req.body, (err, product)=>{
    if(err) return next(err);
    console.log(product);
    res.redirect("/products/" + product._id);
  });
});

router.get("/:id", (req,res,next)=>{
  let id = req.params.id;
  Product.findById(id).populate("comments").exec((err, product)=>{
    if(err) return next(err);
    err = req.flash("error");
    res.render("productDetails", {product,err});
  });
});

router.get("/:id/edit",(req,res,next)=>{
  let id = req.params.id;
  if(req.session.role === 'admin' && req.session.userId) {
    err = req.flash("error");
    Product.findById(id, (err, product)=>{
      if(err) return next(err);
      res.render("updateProduct", {product, err});
    });
  } else {
    req.flash("error", "Only adimin can edit Product");
    res.redirect("/products/"+id);
  }
});

router.post("/:id/edit",(req,res,next)=>{
  let id = req.params.id;
  Product.findByIdAndUpdate(id, req.body, (err, product)=>{
    console.log(product);
    if(err) return next(err);
    res.redirect("/products/" + product._id);
  });
});

router.get("/:id/likes",(req,res,next)=>{
  let id = req.params.id;
  Product.findByIdAndUpdate(id, {$inc : { likes: 1 }}, {new:true}, (err, product)=>{
    if(err) return next(err);
    res.redirect("/products/" + product._id);
  });
});

router.get("/:id/delete",(req,res,next)=>{
  let id = req.params.id;
  if(req.session.role === 'admin' && req.session.userId) {
    Product.findByIdAndDelete(id, (err, product)=>{
      if(err) return next(err);
      Comment.deleteMany({product:product._id}, (err,comment)=>{
        if(err) return next(err);
        res.redirect("/products/dashboard");
      });
    });
  } else {
    req.flash("error", "Only adimin can Delete Product");
    res.redirect("/products/"+id);
  }
});

router.post("/:id/comments",(req,res,next)=>{
  let id = req.params.id;
  req.body.product = id;
  Comment.create(req.body, (err, comment)=>{
    if(err) return next(err);
    Product.findByIdAndUpdate(id, {$push : {comments: comment._id}}, {new:true}, (err, product)=>{
      if(err) return next(err);
      res.redirect("/products/" + product._id);
    });
  });
});

module.exports = router;
