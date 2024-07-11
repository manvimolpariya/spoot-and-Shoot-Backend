const Joi = require('joi')
const Feedback = require('../models/feedback.model')

const feedbackMessage = async(req, res, next) =>{
    const feedbackSchema = Joi.object({
        username : Joi.string().min(3).max(40).required(),
        contact : Joi.string().min(10).max(13).required(),
        gmail : Joi.string().required(),
        message : Joi.string().required()
    })
    const {error} = feedbackSchema.validate(req.body);
    if(error){
        return next(error);
    }
    try {
        const {username, contact, gmail, message} = req.body
    
        const feedbackCreate = await Feedback.Feedback.create({
            username,
            contact,
            message,
            gmail
        })
        if(!feedbackCreate){
            return next(error);
        }
        return res.status(200).json({"feedback" : "created",  auth : true})
    } catch (error) {
        console.log(error);
        return next(error);
    }
}
module.exports = {feedbackMessage}