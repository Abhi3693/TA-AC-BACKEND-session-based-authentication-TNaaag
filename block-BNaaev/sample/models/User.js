var mongoose = require('mongoose');
let bcrypt = require("bcrypt");

let Schema = mongoose.Schema;

let userSchema = new Schema({
  name:{type:String, required:true},
  email:{type:String, unique:true},
  phone:{type:Number},
  age:{type:Number, default:0},
  password:{type:String, minlength:5, required:true},
}, {timestamps:true});



userSchema.pre("save", function (next) {
  console.log(this.password);
  if(this.password && this.isModified("password")) {
    bcrypt.hash(this.password, 10, (err, hashed)=>{
      if(err) return next(err);
      this.password = hashed;
      return next();
    });
  } else {
    return next();
  }
})



let User = mongoose.model("User", userSchema);


module.exports = User;