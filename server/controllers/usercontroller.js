const jwt=require('jsonwebtoken');
const asyncHandler=require("express-async-handler");
const User=require('../models/user')
const generateToken= require('../utils/generateToken')
const bcrypt =require('bcryptjs')
const registerUser= asyncHandler(async (req,res)=>{
   
        const {name, email,password}= req.body;
        if(!name || !email || !password){
            return res.status(400).json({message:"all fields are required"});
        }
        if(password.length<6){
            return res.status(400).json({message:"password must be 6 characters"})
        }
        const existingUser = await User.findOne({email});
        if(existingUser){
            return res.status(400).json({ message: "user already exists"})
        }
        const salt =await bcrypt.genSalt(10);
        const hashedPassword= await bcrypt.hash(password, salt);
        const user= await User.create({
            name,
            email,
            password : hashedPassword
        
        })
        res.status(201).json({
            _id: user._id,
            name:user.name,
            email:user.email
        });
    
});


const loginUser= asyncHandler(async(req,res)=>{

    const {email, password}= req.body;
    if(!email || !password){
        return res.status(400).json({message:"all fields are mendatory"});
    }
    const user= await User.findOne({email});
     if(!user){
        return res.status(400).json({message:"account does not exist"})
     }
     const isMatch =await bcrypt.compare(password,user.password);
     if(!isMatch){
        return res.status(400).json({message:"invalid Password"})
     }
    const token=generateToken(user._id);
           res.status(200).json({message:"login successfull",token});
 
})


const getProfile= async (req,res)=>{
    res.status(200).json({message:"welcome to profile", user:req.user});
}


module.exports={
    registerUser,
    loginUser, 
    getProfile
}