const express = require('express');
const {extend} = require('lodash');
const {User} = require('../models/user.model.js')

const router = express.Router();

router.route('/')
.get((req, res) => {
  res.json({message:'signup under progress'})
})
.post(async (req, res)=>{
  try{
    const newUserObj = req.body;
    const newUser = new User(newUserObj);
    const savedData = await newUser.save();
    res.status(201).json({success:true, data: savedData})
  }catch(err){
    res.status(500).json({success:false, errorMessage:err.message})
  }
})

module.exports = router