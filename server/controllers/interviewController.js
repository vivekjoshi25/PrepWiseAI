const asyncHandler=require("express-async-handler");
const Interview=require('../models/interview');
const {generateQuestions, evaluateAnswers}=require('../utils/ai')
const createInterview=asyncHandler(async(req,res)=>{
    const{role}= req.body;
    if(!role){
        return res.status(400).json({message:"role is required"});
    }
    const questions=await generateQuestions(role);
    const interview=await Interview.create({
        user:req.user._id,
        role,
        questions
    })
    res.status(201).json(interview);
})
const getmyInterviews= asyncHandler(async (req ,res)=>{
    const interviews=await Interview.find({
        user:req.user._id
    })
    res.status(200).json(interviews);
})
const submitInterview =asyncHandler(async (req,res)=>{
    const {answers}= req.body;
    const interview=await Interview.findById(req.params.id);
    if(!interview){
        return res.status(404).json({message:'interview not found'});
    }
    const result= await evaluateAnswers(
        interview.questions,
        answers
    );
    interview.answers=answers;
    interview.score=result.score;
    interview.feedback=result.feedback;
    await interview.save();
    res.status(200).json(interview);
})
module.exports= {createInterview, getmyInterviews, submitInterview};