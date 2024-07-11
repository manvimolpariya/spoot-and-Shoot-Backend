const mongoose = require('mongoose');
const bcrypt =require('bcrypt');
const jwt = require('jsonwebtoken');
const userSchema = new mongoose.Schema({
    username : {
        type: String,
        required : true,
        unique: true,
        trim: true,
        lowercase: true,
        index:true
    },
    idProof :{
     type: String,
     required : true,
     unique: true,
     trim: true,
     index: true
    },
    email : {
        type: String,
        required : true,
        unique: true,
        lowercase: true
    },
    name :{
        type: String,
        required : true,
    },
    password :{
        type: String,
        required :[true, 'Password is required'] 
    },
    refreshToken :{
        type: String,  
    },
},{timestamps: true});
userSchema.pre("save", async function(next){
    if(!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});
userSchema.methods.ispasswordCorrect = async function(password){
  return await bcrypt.compare(password, this.password)
}
userSchema.methods.generateAccessToken = function(){
    return jwt.sign({
        _id : this._id
    }, process.env.ACCESS_TOKEN_SECRET ,
     { expiresIn : process.env.ACCESS_TOKEN_EXPIRY})
} 
userSchema.methods.generateRefreshToken = function(){
    return jwt.sign({
        _id : this._id
    }, process.env.REFRESH_TOKEN_SECRET ,
     { expiresIn : process.env.REFRESH_TOKEN_EXPIRY})
} 
const User = mongoose.model("User", userSchema);
module.exports = { User 
}