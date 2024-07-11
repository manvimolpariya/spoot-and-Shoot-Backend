const Joi = require('joi')
const Jimp = require('jimp')
const MissingReport = require('../models/Missing.model');
const MissingDTO = require('../dto/missing.data');
const fs = require('fs');
const riseReport = async (req, res, next) =>{
    const missingRegisterSchema = Joi.object({
        person_name : Joi.string().max(30).required(),
        gaurdian_name : Joi.string().max(30).required(),
        missing_date  : Joi.string().max(30).required(),
        age : Joi.string().required(),
        religion : Joi.string().valid('hindu', 'muslim', 'others', "Others", "Hindu", "Muslim").required(),
        gender : Joi.string().min(3).max(6).valid('female', 'male', 'others', "Others", "Female", "Male").required(),
        IdProof : Joi.string().required(),
        missing_location : Joi.string().required(),
        contact : Joi.string().required(),
         missing_image:Joi.string().optional(),
        gaurdian_id : Joi.string().optional(),
         missing_status : Joi.string().optional(),
     });
     const {error} = missingRegisterSchema.validate(req.body);
     if (error){
        return next(error);
        }
        const {
            person_name, 
            gaurdian_name, 
            missing_date, 
            age,  
            religion, 
            gender, 
            IdProof, 
            missing_location, 
            contact, 
            
              } = req.body;
       try {
         const existedUser = await MissingReport.MissingReport.findOne({
             $or  :[{IdProof}]
         })
 
         if(existedUser){
            if(existedUser.IdProof === IdProof){
                let error ="Missing report of this person is already exist"
                    return next(error);
                }
         }
     const  missing_imageLocalPath =`${req.file.originalname}`

     if(!missing_imageLocalPath){
        let error ="upload image"
                    return next(error);
     }
      
         const missinguser = await MissingReport.MissingReport.create({
            person_name, 
            gaurdian_name, 
            missing_date, 
            age,  
            religion, 
            gender, 
            IdProof, 
            missing_location, 
            contact, 
            missing_image : missing_imageLocalPath,
            gaurdian_id :  req.user._id,
            missing_status : "missing"
         })

         const createUser = await MissingReport.MissingReport.findById(missinguser._id);
         if(!createUser){
            return next(error);
        }
        const userDto = new MissingDTO(createUser);
        return res.status(201).json({createUser : userDto, auth : true})
       } catch (error) {
        return next(error);
       }
    }
    const missingDetail = async(req, res, next) =>{
        try {
            const getUser = await MissingReport.MissingReport.find({gaurdian_id : req.user._id});
             if(!getUser){
                  const error = {
                    status : 403,
                    message : "no missing report found"
                  }
                  return next(error)
             }
            //  const missingPerson = {
            //  _id  : getUser._id,
            //   person_name:  getUser.person_name, 
            //   gaurdian_name :  getUser.gaurdian_name, 
            //   missing_date : getUser.missing_date, 
            //     age : getUser.age,  
            //     religion : getUser.religion, 
            //     gender : getUser.gender, 
            //     IdProof : getUser.IdProof, 
            //     missing_location: getUser.missing_location, 
            //     contact:  getUser.contact, 
            //     missing_image  :  getUser.missing_image ,
            //     gaurdian_id : getUser.req.user_id
            //  }
            // const missingPerson = await MissingReport.MissingReport.findById(getUser._id);
            //  const userDto = new MissingDTO(missingPerson);
            //  console.log(getUser)
             return res.status(201).json({getperson : getUser, auth : true}) 
        } catch (error) {
            return next(error);
        }
    }

    const allMissingDetails = async(req, res, next) =>{
         try {
            const users = await MissingReport.MissingReport.find({});
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


    const updateMissingReport = async(req, res, next) =>{
        
      try {
        const missingRegisterSchema = Joi.object({
          person_name : Joi.string().max(30),
          gaurdian_name : Joi.string().max(30),
          missing_date  : Joi.string().max(30),
          age : Joi.string(),
          religion : Joi.string().valid('hindu', 'muslim', 'other', "Hindu", "Muslim", "Others"),
          gender : Joi.string().min(3).max(6).valid('female', 'male', 'others', "Others", "Female", "Male"),
          IdProof : Joi.string(),
          missing_location : Joi.string(),
          contact : Joi.string(),
          missing_status : Joi.string(),
       });
       const {error} = missingRegisterSchema.validate(req.body);
       if (error){
          return next(error);
          }
       const {person_name, 
        gaurdian_name, 
        missing_date, 
         age,  
         religion, 
         gender, 
         IdProof, 
         missing_location, 
         contact,
         missing_status
      } = req.body;
    
      const updatedUser = await MissingReport.MissingReport.findByIdAndUpdate(req.params.id, {
        $set : {
          person_name,
          gaurdian_name, 
          missing_date, 
           age,  
           religion, 
           gender, 
           IdProof, 
           missing_location, 
           contact,
           missing_status,
         
        }
        
      })
      if(!updatedUser){
        const  error = {
          status : 405,
          message : "error while updating"
        }
        return next(error)
      }
     const user = await MissingReport.MissingReport.find({_id : req.params.id});
     if(!user){
      const error ={
        status : 405,
        message : "update fail"
      }
      return next(error);
     }
       return res.status(201).json({getperson : user, auth : true})
        
      } catch (error) {
        console.log(error);
        return next(error);
      }
    }


    const updateReportImage = async(req, res, next) =>{
          try {
           const validationSchema =  Joi.object({
             missing_image : Joi.string().optional(),
           })
           const {error} = validationSchema.validate(req.body);
           if(error){
            return next(error);
           }
         //  console.log(req.file.originalname)
           const userUpdate = await MissingReport.MissingReport.findByIdAndUpdate(req.params.id, {
            $set :{
              missing_image : `${req.file.originalname}`
            }
           })
           if(!userUpdate){
            const error ={
              status : 403,
              message  : "error while updating image"
            }
            return next(error);
           }
           const user = await MissingReport.MissingReport.find({_id : userUpdate.id});
           if(!user){
            const error ={
              status : 403,
              message  : "fail image updation"
            }
            return next(error);
           }
          return res.status(200).json({updateUser : user, auth : true})
          } catch (error) {
            return next(error);
          }
    }
    const deleteReport = async (req, res, next) =>{
    try {
      const user = await MissingReport.MissingReport.findByIdAndDelete({_id : req.params.id})
      if(!user){
        const error = {
          status : 404,
          message : "user not found to delete"
        }
        return next(error);
      }
     return res.status(200).json({user: {} , auth : true});
    } catch (error) {
      return next(error)
    }
    }
    const getReportById = async ( req, res, next) =>{
      try {
     const user = await MissingReport.MissingReport.find( {_id : req.params.id});
     if(!user){
      message = 'not such missing report gound';
      return next(message);
     }
     return res.status(200).json({findUser : user, auth : true});
      } catch (error) {
         console.log(error);
         return next(error);
      }
    }
    const compareImage = async (req, res, next) =>{
    try {
      const validationSchema =  Joi.object({
        missing_image : Joi.string().optional(),
      })
      const {error} = validationSchema.validate(req.body);
      if(error){
       return next(error);
      }
      const user = await MissingReport.MissingReport.find();
      if(!user){
        const message = 'record not found';
        return next(message);
      }
       
      const jimUserFile = await Jimp.read(`public/temp/${req.file.originalname}`);
      let imageFound = false;
      for (const obj of user) {
         // console.log(obj.missing_image)
       const jimUserFile1 = await Jimp.read(`public/temp/${obj.missing_image}`);
      //hash
       const exampleHash = jimUserFile.hash();
       console.log(exampleHash)
       const exampleHash1 = jimUserFile1.hash();
       console.log(exampleHash1)
       //distance
       const distance = Jimp.distance(jimUserFile, jimUserFile1);
       //diff
       const diff = Jimp.diff(jimUserFile, jimUserFile1)

       if(exampleHash === exampleHash1 && distance <= 0.15 && diff.percent <= 0.15){
        imageFound = true;
        break;
       }
      }
      if(imageFound)
      {
        return res.status(200).json({ Image :'Image match', image_name:`${req.file.originalname}` , auth : true });
      }
      else{
        return res.status(403).json({Image : 'Image not match', image_name:`${req.file.originalname}`, auth : true })
      }
    } catch (error) {
      console.log("hear error occured"+error);
      return next(error);
    }
    }
module.exports ={riseReport,
                 missingDetail ,
                 allMissingDetails,
                 updateMissingReport,
                 updateReportImage,
                 deleteReport,
                 getReportById,
                 compareImage
                }