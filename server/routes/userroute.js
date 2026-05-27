const bcrypt=require('bcryptjs');
const protect=require('../middleware/authMiddleware');
const {registerUser, loginUser, getProfile}= require('../controllers/usercontroller');
const express=require('express');
const User=require('../models/user')

const router= express.Router();
router.get("/",(req,res)=>{
    res.send('user route working');
})
router.post('/register',registerUser);
router.post('/login', loginUser);
router.get('/profile',protect,getProfile);
module.exports=router;
