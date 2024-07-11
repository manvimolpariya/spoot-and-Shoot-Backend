const Joi = require('joi')
const User = require('../models/User.models')
const UserDTO = require('../dto/user.data')
const jwt = require('jsonwebtoken');
const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,25}$/;
const generateAccessAndRefreshToken = async (userId,next) =>{
try {
    const user = await  User.User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken
    await user.save({validateBeforeSave : false})
    return {accessToken, refreshToken}
} catch (error) {
    return next(error);
}
} 



const loginUser = async (req, res, next) =>{
    //find the user
    //password check
    //access and refreshh token
    //send cookie
    //response send
    const userLoginSchema = Joi.object({
    username : Joi.string().min(5).max(30).required(),
    password : Joi.string().pattern(passwordPattern).required()
    })
    const {error} = userLoginSchema.validate(req.body);
    if(error){
    return next(error);
    }
 const {email, username, password} = req.body;
  let user;
  try {
    user = await User.User.findOne({username : username});
    if(!user){
        const error = {
            status : 401,
            message : 'Invalid username'
        }
        return next(error);
        }
        // const match = await bcrypt.compare(password, user.password);
        const match = await user.ispasswordCorrect(password);
        if(!match){
           const error = {
            status : 401,
            message : "Invalid Password"
           }
           return next(error);
        }
  } catch (error) {
    return next(error);
  }
const {accessToken, refreshToken} = await generateAccessAndRefreshToken(user._id)
  const logedInUser = await User.User.findById(user._id).select("-password -refreshToken");
const options ={
    httpOnly : true,
    secure : true
   }

 const userDto = new UserDTO(logedInUser);
 return res.status(200)
 .cookie("accessToken", accessToken, options)
 .cookie("refreshToken", refreshToken, options)
 .json({user : userDto , auth : true})
}

const logoutUser = async (req, res, next) =>{
    await User.User.findByIdAndUpdate(
        req.user._id,{
            $set : {
                refreshToken : ''
            }
        }
    )
    const options = {
        httpOnly : true,
        secure : true
    }
    return res.status(200)
    .clearCookie("accessToken", options)
    .clearCookie('refreshToken', options)
    .json({data : {},  message :"User logged out", auth : false})
}
const register = async (req, res, next) =>{
 // get user details from frontend
 //validation  - not empty
 //check if user already exists :username , emails ,id proof
 //create user object - create entry  in db
 //remove password and refresh token from response
 //check for user creation
 //return res
 const userRegisterSchema = Joi.object({
    username : Joi.string().min(5).max(30).required(),
    name : Joi.string().max(30).required(),
    email : Joi.string().email().required(),
    password : Joi.string().pattern(passwordPattern).required(),
    idProof : Joi.string().required(),
    refreshToken : Joi.string().allow('').optional()
 });
 const {error} = userRegisterSchema.validate(req.body);
 if (error){
 return next(error);
 }
 const { username, name, email, password, idProof} = req.body;
 try {
    const existedUser = await User.User.findOne({
       $or :[{username}, {email} , {idProof}]
    })
    if(existedUser){
       if(existedUser.username === username){
       let error ="username already exist..choose different username"
           return next(error);
       }
       else if(existedUser.email === email){
           let error ="email already exist..choose different email"
           
               return next(error);
           }
           else if (existedUser.idProof === idProof){
               let error = "id proof already exist..choose different id proof"
                   return next(error);
               }
    }
    
    const user = await User.User.create({
        username,
        email,
        password,
        idProof,
        name,
        refreshToken : ''
    })
    const {accessToken, refreshToken} = await generateAccessAndRefreshToken(user._id);
    user.refreshToken = refreshToken ;
    const createUser = await User.User.findById(user._id).select('-password -refreshToken');
    if(!createUser){
        return next(error);
    }
    const userDto = new UserDTO(createUser);
    const options = {
        httpOnly : true,
        secure : true
    }
    return res.status(201)
     .cookie("accessToken", accessToken, options)
     .cookie("refreshToken", refreshToken, options)
    .json({createUser : userDto, auth : true})
 } catch (error) {
    return next(error);
 }


}
module.exports = {loginUser,
                  logoutUser,
                  register
}