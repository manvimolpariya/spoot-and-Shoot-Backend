const Admin = require("../models/Admin.model");
const AdminDTO = require("../dto/admin.data")
const User = require("../models/User.models")
const Joi = require('joi');

const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,25}$/;
const Adminlogin = async (req, res, next) =>{
    const userLoginSchema = Joi.object({
        username : Joi.string().min(5).max(30).required(),
        password : Joi.string().pattern(passwordPattern).required()
        })
       
        const {error} = userLoginSchema.validate(req.body);
        if(error){
        return next(error);
        }
        
        const {username , password} = req.body;
        console.log(password);
  let admin;
  try {
    admin = await Admin.Admin.find({username : username});
    if(!admin){
      const  adminmessage = "username not found";
      return next(adminmessage)
    }
    return res.status(201).json({Admin : admin , auth : true})
   
    }catch(error){
        console.log(error);
    }
}


const Adminregister = async (req, res, next) =>{
    // get user details from frontend
    //validation  - not empty
    //check if user already exists :username , emails ,id proof
    //create user object - create entry  in db
    //remove password and refresh token from response
    //check for user creation
    //return res
    const userRegisterSchema = Joi.object({
       username : Joi.string().min(5).max(30).required(),
       password : Joi.string().pattern(passwordPattern).required(),
      
    });
    const {error} = userRegisterSchema.validate(req.body);
    if (error){
    return next(error);
    }
    const { username, password} = req.body;
    try {
       const existedUser = await Admin.Admin.findOne({
          $or :[{username}]
       })
       if(existedUser){
          if(existedUser.username === username){
          let error ="username already exist..choose different username"
              return next(error);
          }
       }
       
       const user = await Admin.Admin.create({
           username,
           password,
       })
       
       const createUser = await Admin.Admin.findById(user._id).select('-password -refreshToken');
       if(!createUser){
           return next(error);
       }
       const userDto = new AdminDTO(createUser);
      
       return res.status(201)
       .json({createUser : userDto, auth : true})
    } catch (error) {
       return next(error);
    }
   
   
   }

   const AllUsers = async (req, res, next)=>{
    try {
        const users = await User.User.find({});
        if(!users){
            const error = {
              status : 403,
              message : "no missing report found"
            }
            return next(error)
       }

       return res.status(201).json({getperson : users, auth : true})

     } catch (error) {
        return  next(error);
     }
   }
module.exports = {Adminlogin,
    Adminregister,
    AllUsers
} ;
