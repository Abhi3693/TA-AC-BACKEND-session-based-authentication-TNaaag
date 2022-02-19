let mongoose = require("mongoose");

let Schema = mongoose.Schema;

let commentSchema = new Schema({
  article:{type:Schema.Types.ObjectId, ref:"Article", required:true},
  text:String,
  slug:String,
});

let Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;
