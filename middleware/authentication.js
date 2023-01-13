const userModel=require('../models/User') ;
const jwt=require("jsonwebtoken"); 
const {UnauthenticatedError}=require('../errors')

const auth=async(req,res,next)=>{
   const autho=req.headers.authorization;

   if(!autho||!autho.startsWith('Bearer '))
   throw new UnauthenticatedError ('Authentication invalid'); 
   const token=autho.split(' ')[1]
   try {   
    const payload=jwt.verify(token,process.env.JWT_SECRET) ;
    req.user={userId:payload.userId,name:payload.name}
    next();
   
   } catch (error) {
    throw new UnauthenticatedError ('Authentication invalid'); 
   }


}

module.exports=auth