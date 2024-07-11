const mongoose = require('mongoose');
const connectDB = async () =>{
    try {
        const connectionInstance = await mongoose.connect(process.env.DATABASE_URL);
        console.log(`\n mongodb connected !! DB Host :${connectionInstance.connection.host}`);
    } catch(error){
        console.log("mongodb connection failed");
        process.exit(1);
    }
}
module.exports = { connectDB}