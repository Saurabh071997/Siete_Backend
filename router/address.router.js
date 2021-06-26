require('dotenv').config()
const express = require('express');
const {extend} = require('lodash');
const {Address} = require('../models/address.model.js')
const {authenticateToken} = require('../utils/authenticateToken.js')

const router = express.Router()

router.use('/users', authenticateToken)

router.use('/users', async (req, res, next) => {
  try{
    let {userId} = req

    let addresses = await Address.findOne({__userId: userId})

    if(!addresses){
      addresses = new Address({__userId:userId, addresslist:[]})
      addresses = await addresses.save()
    }

    req.addresses = addresses
    next()
  }catch(err){
    res.status(400).json({success:false, message:`Failed to access address`})
  }
})

router.route('/users')
.get(async(req, res)=>{
  let {addresses} = req
  res.status(200).json({success:true, data:addresses})
})
.post(async(req, res)=>{
  try{
    let {addresses} = req
    let { action, addressObj} = req.body 
    let statusCode;
    
    switch(action){
      case "ADD": 
        statusCode = 201
        addresses.addresslist.push(addressObj)
        break
      
      case "UPDATE":
        statusCode = 200
        const addressUpdateId = addressObj.id
        // console.log({addressUpdateId})
        for(let addressItem of addresses.addresslist){
          if(addressItem._id == addressUpdateId){
            addressItem.address = addressObj.address
            addressItem.locality = addressObj.locality
            addressItem.city = addressObj.city
            addressItem.state = addressObj.state
            addressItem.country = addressObj.country
            addressItem.pincode = addressObj.pincode
            addressItem.isSelected = addressObj.isSelected
          }
        }
        break

      case "SET_DEFAULT":
        statusCode = 200
        const addressDefaultId = addressObj.id
        for(let addressItem of addresses.addresslist){
          if(addressItem._id == addressDefaultId){
            addressItem.isSelected = true
          }else{
            addressItem.isSelected = false
          }
        }
        break;
      
      case "REMOVE":
        statusCode = 200
        const addressRemoveId = addressObj.id
        addresses.addresslist = addresses.addresslist.filter(({_id})=> _id != addressRemoveId)
        break
    }

    addresses = await addresses.save()
    res.status(statusCode).json({success:true, data: addresses})

  }catch(err){
    res.status(500).json({success:false, message:"Failed to Update Address"})
  }
})

module.exports = router