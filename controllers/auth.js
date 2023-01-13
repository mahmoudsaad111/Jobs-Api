const userModel=require('../models/User')
const {StatusCodes}=require('http-status-codes'); 
const {BadRequestError,UnauthenticatedError}=require('../errors/index')

const register=async(req,res)=>{
 
   const user=await userModel.create({...req.body})
   const token=user.createJWT();
    res.status(StatusCodes.CREATED).json({user:{name:user.name},token}); 
   
}
const login=async(req,res)=>{
    const {email,password}=req.body ;
    if(!email||!password)
    throw new BadRequestError("please provide email and password");   
     

   const user=await userModel.findOne({email}); 
   if(!user)
   throw new UnauthenticatedError ("Invalid creditials ");

   const validPass=await user.comparePass(password); 
 
    if(!validPass)
    throw new UnauthenticatedError ("Invalid creditials ");

   const token=user.createJWT();
      res.status(StatusCodes.OK).json({user:{name:user.name},token}); 
   
}

module.exports={register,login}