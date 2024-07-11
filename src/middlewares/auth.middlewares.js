const User = require('../models/User.models');
const jwt = require('jsonwebtoken');

const verifyJWT = async(req, res, next) =>{
try {
    const token = req.cookies?.accessToken;
    if(!token){
        const error ={
            status : 403,
            message : 'token expire'
        }
        return next(error);
    }
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const user = await User.User.findById(decodedToken?._id).select("-password -refreshToken")

    if(!user){
        const error ={
            status : 401,
            message : 'Invalid User'
        }
        return next(error);
    }
    req.user = user;
    next();
} catch (error) {
    return next(error);
}
}

module.exports = verifyJWT