let mongoose = require("mongoose");
let bcrypt = require("bcrypt");

let Schema = mongoose.Schema;

let bagSchema = new Schema({
  items:[{type:Schema.Types.ObjectId, required:true, ref:"Product"}],
  user:{type:Schema.Types.ObjectId, required:true, ref:"Product"},
});


let Bag = mongoose.model("Bag", bagSchema);

module.exports = Bag;
