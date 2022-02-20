let mongoose = require("mongoose");
let bcrypt = require("bcrypt");
const Product = require("./Product");

let Schema = mongoose.Schema;

let userSchema = new Schema({
  username:{type:String, required:true},
  email:{type:String, required:true, unique:true},
  password:{type:String, required:true},
  role:{type:String, required:true},
  bag:[{type:Schema.Types.ObjectId, ref:"Product"}]
});

userSchema.pre("save", function (next) {
  if(this.password && this.isModified("password")) {
    bcrypt.hash(this.password, 10 , (err, hashed)=>{
      if(err) return next(err);
      this.password = hashed;
      return next();
    });
  } else {
    return next();
  }
});


userSchema.methods.verifypassword = function (password, role ,cb) {
  bcrypt.compare(password, this.password, (err, result)=>{
    return cb(err, result);
  });
};

let User = mongoose.model("User", userSchema);

module.exports = User;
