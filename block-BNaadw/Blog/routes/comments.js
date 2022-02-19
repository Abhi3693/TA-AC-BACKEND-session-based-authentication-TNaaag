let Comment = require("../models/Comment");
var express = require('express');
let Article = require("../models/Article");
var router = express.Router();


router.get("/:id/edit", (req,res,next)=>{
  let id = req.params.id;
  Comment.findById(id, (err, comment)=>{
    console.log(comment, "comment====");
    if(err) return next(err);
    res.render("updateComment", {comment});
  })
});

router.post("/:id/edit", (req,res,next)=>{
  let id = req.params.id;
  Comment.findByIdAndUpdate(id, req.body, {new:true}, (err, comment)=>{
    if(err) return next(err);
    res.redirect("/articles/" + comment.slug);
  });
});


router.get("/:id/delete", (req,res,next)=>{
  let id = req.params.id;
  Comment.findByIdAndDelete(id, (err, comment)=>{
    if(err) return next(err);
    res.redirect("/articles/" + comment.slug);
  });
});

module.exports = router;