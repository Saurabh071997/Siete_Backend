require('dotenv').config()
const express = require('express')
const bcrypt = require('bcrypt')
const {extend} = require('lodash')
const jwt = require('jsonwebtoken')
const {authenticateToken} = require('../utils/authenticateToken.js')


const {User} = require('../models/user.model.js')

const router = express.Router()

router.route('/')
.get(async(req, res)=>{
    res.json({message:'user login api'})
})
.post(async(req, res)=>{
  try{
      const {usermail, userpassword} = req.body
      const user = await User.findOne({email:usermail})

      if(!user){
        return res.status(400).json({success:false, loggedInUser:null, errorMessage:"No user exist with this mail"})
      }

      if(await bcrypt.compare(userpassword, user.password)){
        const userId = user._id
        const accessToken = jwt.sign({userId}, process.env.ACCESS_TOKEN, {expiresIn:'24h'})
        return res.status(200).json({success:true, loggedInUser: user, accessToken})
      }else{
        return res.status(401).json({success:false, errorMessage:'login failed'})
      }

  }catch(err){
    res.status(500).json({success:false, loggedInUser:null, errorMessage:err.message})
  }

})



// router.use('/check',authenticateToken)
// router.route('/check')
// .get((req, res)=>{
//   const {userId} = req
//   res.status(200).json({userId})
// })

module.exports = router