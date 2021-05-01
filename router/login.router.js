const express = require('express');
const {extend} = require('lodash');

const {User} = require('../models/user.model.js')

const router = express.Router();

router.route('/')
.get(async(req, res)=>{
  try{
    res.json({message:'login in progress'})
  }catch(err){
    res.status(500).json({success:false, errorMessage:'Failed to access data'});
  }
})
.post(async(req, res)=>{
  try{
      const {usermail, userpassword} = req.body;
      const user = await User.findOne({email:usermail , password:userpassword})

    if(!user){
      return res.status(400).json({success:false, userLogin:false, loggedInUser:null})
    }

    res.status(201).json({success:true, userLogin:true, loggedInUser: user})
  }catch(err){
    res.status(400).json({success:false, userLogin:false, loggedInUser:null})
  }

})

module.exports = router