const mongoose  =require('mongoose');
const feedbackSchema = new mongoose.Schema({
  username : {
    type : String,
    required : true
  },
  contact :{
    type : String,
    required : true
  },
  gmail :{
    type : String,
    require : true
  },
  message :{
    type : String,
    required : true
  }
})
const Feedback = mongoose.model("Feedback", feedbackSchema);
module.exports = { Feedback 
}