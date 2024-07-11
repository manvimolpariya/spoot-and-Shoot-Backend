const mongoose  =require('mongoose');
const contactSchema = new mongoose.Schema({
  name : {
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
  }
})
const Contact = mongoose.model("Contact", contactSchema);
module.exports = { Contact 
}