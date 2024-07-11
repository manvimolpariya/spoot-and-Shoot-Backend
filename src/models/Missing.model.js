const mongoose  =require('mongoose');
const {Schema} = require('mongoose');
const reportSchema = new mongoose.Schema({
    person_name:{
        type: String,
        required : true,
        trim: true,
        lowercase: true,
        index:true
    },
    gaurdian_name:{
        type: String,
        required : true,
        trim: true,
        lowercase: true,
    },
    missing_date :{
        type: String,
        required : true,
    },
    age :{
        type : String,
        required : true,
        lowercase: true,
    },
    religion :{
      type : [String, "Please enterd valid religion"],
      required : true
    },
    gender :{
      type :[String, "Please enterd valid gender"],
      required : true
    },
    IdProof : {
       type : String,
       unique: true,
       required : true
    },
    missing_location:{
        type : String,
        required : true
    },
    contact:{
        type :String,
        required: true
    },
    missing_image :{
      type : String,
      required : true
    },
    gaurdian_id:{
        type: Schema.Types.ObjectId,
        ref : "User"
    },
    missing_status:{
        type : String
    }
},{timestamps: true})

const MissingReport = mongoose.model("MissingReport", reportSchema);

module.exports = {MissingReport}