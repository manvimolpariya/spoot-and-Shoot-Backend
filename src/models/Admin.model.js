const mongoose = require('mongoose')

const AdminSchema = new mongoose.Schema({
    username : {
        type: String,
        required : true,
        unique: true,
        trim: true,
        lowercase: true,
        index:true
    },
    password :{
        type: String,
        required :[true, 'Password is required'] 
    }
},{timestamps : true});
const Admin = mongoose.model("Admin", AdminSchema);
module.exports =  {Admin}