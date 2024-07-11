const Joi = require('joi')
const Contact = require('../models/contact.model')

const contactMessage = async(req, res, next) =>{
    const contactSchema = Joi.object({
        name : Joi.string().min(3).max(40).required(),
        contact : Joi.string().min(10).max(13).required(),
        gmail : Joi.string().required(),
    })
    const {error} = contactSchema.validate(req.body);
    if(error){
        return next(error);
    }
    try {
        const {name, contact, gmail} = req.body
    
        const contactCreate = await Contact.Contact.create({
           name,
            contact,
            gmail
        })
        if(!contactCreate){
            return next(error);
        }
        return res.status(200).json({ "response" : "send"})
    } catch (error) {
        console.log(error);
        return next(error);
    }
}
module.exports = {contactMessage}
