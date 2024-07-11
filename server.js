const express = require('express');
const errorHandler = require('./src/middlewares/errorHandle.js');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const corsOption ={
    credentials : true,
    origin : ['http://localhost:5173'],
    
}
const app = express();
app.use(cors(corsOption))
app.use(express.json({limit : '16kb'}));
app.use(express.urlencoded({extended : true, limit : "1000kb"}));
app.use(express.static('public'));
app.use(errorHandler);
app.use(cookieParser());

const userRouter = require('./src/routes/user.routes.js');
app.use("/api/v1/users", userRouter);

module.exports = {app};