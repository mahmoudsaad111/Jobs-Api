const mongoose=require('mongoose');

const jobSchema=new mongoose.Schema({
    company:{
        type:String,
        requiref:[true,"please provide company name"],
        maxlength:50
    },
    position:{
        type:String,
        required:[true,"please provide position name"],
        maxlength:100
    },
    status:{
        type:String,
        enum:['pending','interview','declined'],
        default:'pending'
    },
    createdBy:{
     type:mongoose.Types.ObjectId,
     ref:'User',
     required:[true,"please provide user"]
    }
},{timestamps:true})
module.exports=mongoose.model('Jobs',jobSchema)
