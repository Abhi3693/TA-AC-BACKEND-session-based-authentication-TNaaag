var express = require('express');
let Article = require("../models/Article");
var router = express.Router();
let Comment = require("../models/Comment");

/* GET home page. */
router.get('/', function(req, res, next) {
  if(req.session.userId) {
    Article.find({}, (err, articles)=>{
      if(err) return next(err);
      res.render('articles', {articles});
  
    });
  } else {
    req.flash("error", "To View All Article need login first");
    res.redirect("/users/login")
  }
});

router.get('/new', function(req, res, next) {
  if(req.session.userId) {
    if(req.session.new === 1) {
      let err = "One Article can create at one login"
      res.render("err", {err});
    } else {
      res.render('addArticle');
    }
  } else {
    req.flash("error", "To Create article needs login First");
    res.redirect("/users/login");
  }
});

router.post('/', function(req, res, next) {
  if(req.session.userId) {
    Article.create(req.body, (err, article)=>{
      if(err) return next(err);
      req.session.new = 1;
      res.render("articleDetails", {article});
  });
  } else {
    req.flash("error", "To Create article needs login First");
    res.redirect("/users/login");
  }
});

router.get("/:slug", (req,res,next)=>{
  if(req.session.userId){
    let slug = req.params.slug;
    Article.findOne({slug}).populate("comments").exec((err, article)=>{
      console.log(article, "========");
      if(err) return next(err);
      res.render("articleDetails", {article});
    });
  } else{
    req.flash("error", "To Create article needs login First");
    res.redirect("/users/login");
  }
});

router.get("/:slug/edit", (req,res,next)=>{
  if(req.session.userId) {
    if(req.session.edit === 1) {
      let err = "One Article can update at one login"
      res.render("err", {err});
    } else {
      let slug = req.params.slug;
      // let id = req.params.id;
      Article.findOne({slug}, (err, article)=>{
        if(err) return next(err);
        res.render("updateArticle", {article});
      });
    }
  } else {
    req.flash("error", "To edit article needs login First");
    res.redirect("/users/login");
  }
});

router.post("/:slug/edit", (req,res,next)=>{
  if(req.session.userId) {
    let slug = req.params.slug;
    console.log(slug,"======slug");
    Article.findOneAndUpdate({slug}, req.body, {new:true},(err, article)=>{
      console.log(article, "========");
      if(err) return next(err);
      req.session.edit = 1;
      res.redirect("/articles/" + slug );
    });
  } else {
    req.flash("error", "To edit article needs login First");
    res.redirect("/users/login");
  }
});

router.get("/:slug/likes", (req,res,next)=>{
  if(req.session.userId) {
    let slug = req.params.slug;
  Article.findOneAndUpdate({slug}, {$inc: {likes: 1}}, {new:true}, (err, article)=>{
    if(err) return next(err);
    res.redirect("/articles/"+ slug);
  });
  } else {
    req.flash("error", "To like article needs login First");
    res.redirect("/users/login");
  }
});

router.post("/:slug/comment", (req,res,next)=>{
  if(req.session.userId) {
    let slug = req.params.slug;
    Article.findOne({slug}, (err, article)=>{
      if(err) return next(err);
      req.body.article = article._id;
      req.body.slug = slug;
      Comment.create(req.body, (err,comment)=>{
        if(err) return next(err);
        console.log(comment._id, "===in comment");
        Article.findOneAndUpdate({slug}, { $push: {comments: comment._id }}, (err, article)=>{
          if(err) return next(err);
          console.log(article, "=====article");
          res.redirect("/articles/"+ slug);
        });
      });
    })
  } else {
    req.flash("error", "To like article needs login First");
    res.redirect("/users/login");
  }
  
});

router.get("/:slug/delete", (req,res,next)=>{
  if(req.session.userId) {
    let slug = req.params.slug;
    console.log( "Inside Delete ========")
    Article.findOneAndDelete({slug},(err,article)=>{
      if(err) return next(err);
      Comment.deleteMany({article:article._id}, (err, comments)=>{
        if(err) return next(err);
        res.redirect("/articles");
      });
    });
  } else {
    req.flash("error", "To Delete article needs login First");
    res.redirect("/users/login");
  }
});

module.exports = router;
