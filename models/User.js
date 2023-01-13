const { string } = require('joi');
const mongoose=require('mongoose'); 
const bcrypt=require('bcryptjs')
const jwt=require('jsonwebtoken'); 

const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:[true,"please enter your name"],
        minlength:3,
        maxlength:50
    },
    password:{
        type:String,
        required:[true,"please enter your password"],
        minlength:6,
       
        
    },
    email:{
        type:String,
        required:[true,"please enter your email"],
        match:[/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        "please provide your email"],
        unique:true
    }
    })

    userSchema.pre('save',async function(next){
        const salt=await bcrypt.genSalt(10) ;
       this.password=await bcrypt.hash(this.password,salt); 
       next()
    })
    userSchema.methods.createJWT = function () {
        return jwt.sign(
          { userId: this._id, name: this.name },
          process.env.JWT_SECRET,
          {
            expiresIn: process.env.JWT_LIFETIME,
          }
        )
      }
      userSchema.methods.comparePass=async function(pass){
          const valid =await bcrypt.compare(pass,this.password);
          
          return valid;  
      }
      

    module.exports=mongoose.model("user",userSchema)