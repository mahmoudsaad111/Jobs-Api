const jobModel=require('../models/Job')
const { StatusCodes } = require('http-status-codes')
const {BadRequestError,NotFoundError}=require('../errors')

const getAllJobs=async(req,res)=>{
    const jobs=await jobModel.find({createdBy:req.user.userId}).sort('createdAt'); 
    res.status(StatusCodes.OK).json({jobs,count:jobs.length})
}
const getJob=async(req,res)=>{
    
const {user:{userId},params:{id:jobId}}=req

 const job=await jobModel.findOne({_id:jobId,createdBy:userId})

  if(!job)
   throw new NotFoundError (`No job with this id ${jobId}`)

   res.status(StatusCodes.OK).json({job})
}

const updateJob=async(req,res)=>{
    const {body:{company,position},
    user:{userId},
    params:{id:jobId}}=req
    
    if(company===''||position==='')
    throw new BadRequestError("company or position fields connot be empty")

    const job=await jobModel.findByIdAndUpdate({_id:jobId,createdBy:userId},req.body,{runValidators:true,new:true})

     if(!job)
      throw new NotFoundError (`No job with this id ${jobId}`)
   
      res.status(StatusCodes.OK).json({job})
}

const createJob=async(req,res)=>{
    req.body.createdBy=req.user.userId
    const newJob=await jobModel.create(req.body)
    res.status(StatusCodes.CREATED).json({newJob})
}

const deleteJob=async(req,res)=>{

  const {params:{id:jobId},user:{userId}}=req
  const job=await jobModel.findByIdAndRemove({_id:jobId,createdBy:userId}); 

  if(!job)
  throw new NotFoundError (`No job with this id ${jobId}`)

  res.status(StatusCodes.OK).send()
}
module.exports={getAllJobs,getJob,updateJob,createJob,deleteJob}
