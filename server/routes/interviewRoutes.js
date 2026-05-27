const express=require('express');
const router=express.Router();
const protect= require('../middleware/authMiddleware');
const {createInterview,getmyInterviews, submitInterview}=require('../controllers/interviewController');
router.post('/create',protect,createInterview);
router.get('/my',protect,getmyInterviews);
router.put('/submit/:id',protect, submitInterview);
module.exports=router;