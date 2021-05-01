const express = require('express');
const {extend} = require('lodash');
const {Wishlist} = require('../models/wishlist.model.js')

const router = express.Router();


router.param('userId', async(req, res, next, userId)=>{
  try{
    let wishlist = await Wishlist.findOne({__userId:userId})
    // let wishlist = await Wishlist.findOne({__userId:userId}).populate({
    //   path:'products',
    //   populate:{
    //     path:'__product'
    //   }
    // })

    if(!wishlist){
      wishlist = new Wishlist({__userId: userId, products:[]});
      wishlist  = await wishlist.save();
    }

    req.wishlist = wishlist
    next();
  }catch(err){
    res.status(400).json({success:false, message:`Failed to access Wishlist`})
  }
})



router.route('/:userId')
.get((req, res)=>{
  let {wishlist} = req;
  res.status(200).json({success:true, data:wishlist});
})
.post(async (req, res)=>{
  try{
    let {wishlist} = req;
    let {__product} = req.body;

    let statusCode;

    const productInWishlist = wishlist.products.some((productObj) => productObj.__product == __product)



    if(productInWishlist){
      statusCode = 200;
    }else{
      statusCode = 201;
      wishlist.products.push({__product})
    }

    wishlist = await wishlist.save();

    res.status(statusCode).json({success:true, data:wishlist})
  }catch(err){
    res.status(500).json({success:false, message:'Failed to Add Product'})
  }
})
.delete(async (req, res) =>{
  try{
      let {__product} = req.body;
      let {wishlist} = req;

      wishlist.products = wishlist.products.filter(productObj => productObj.__product != __product);

      wishlist = await wishlist.save();

      res.status(200).json({success:true, data: wishlist})

  }catch(err){
    res.status(500).json({success:false, message:'Failed to remove product'})
  }
})





module.exports = router

