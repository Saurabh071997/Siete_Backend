const express = require('express')
const {extend} = require('lodash')
const bcrypt = require('bcrypt')
const {User} = require('../models/user.model.js')

const router = express.Router()

router.route('/')
.get((req, res) => {
  res.json({message:'user signup api'})
})
.post(async (req, res)=>{
  try{
    const newUserObj = req.body
    const userObj = await User.findOne({email:newUserObj.email})
    if(userObj){
      return res.status(409).json({success:false, errorMessage:"User mail exist" })
    }

    const salt = await bcrypt.genSalt()
    const hashedPassword = await bcrypt.hash(newUserObj.password, salt)

    const newUser = new User({email:newUserObj.email, password:hashedPassword})
    const savedData = await newUser.save()
    res.status(201).json({success:true, data: savedData})
  }catch(err){
    res.status(500).json({success:false, errorMessage:err.message})
  }
})

module.exports = router