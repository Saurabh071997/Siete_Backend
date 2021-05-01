const express = require('express');
const {extend} = require('lodash');
const {User} = require('../models/user.model.js')

const router = express.Router();

router.param('userId', async(req, res, next, userId)=>{
  try{
    const user = await User.findById(userId);

    if(!user){
      return res.status(400).json({success:false, message:`No user with id ${userId} exists`})
    }

    req.user = user;
    next();

  }catch(err){
    res.status(400).json({success:false, message:`No user with id ${userId} exists`})
  }
})


router.route('/:userId')
.get((req, res)=>{
  let {user} = req;
  user.__v = undefined;
  res.status(200).json({success:true, data: user})
})
.post(async(req, res)=>{
  try{
    let userUpdate = req.body;
    let {user} = req;

    user = extend(user, userUpdate);
    user = await user.save();

    res.json({success:true, data: user})  
  }catch(err){
    res.status(500).json({success:false, message:'Failed to Update User'})
  }
})
.delete(async(req, res)=>{
  let {user} = req;

  user = await user.remove();

  user.deleted = true;

  res.json({success:true, deleted_data: user})
})


module.exports = router