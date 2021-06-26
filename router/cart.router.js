require('dotenv').config()
const express = require('express');
const {extend} = require('lodash');
const {Cart} = require('../models/cart.model.js')
const {authenticateToken} = require('../utils/authenticateToken.js')

const router = express.Router();

router.use('/users', authenticateToken)

router.use('/users', async(req, res, next)=>{
  try{
    let {userId} = req
    let cart = await Cart.findOne({__userId:userId})
    // let cart = await Cart.findOne({__userId:userId}).populate({
    //   path:'products',
    //   populate:{
    //     path:'__product'
    //   }
    // })

    if(!cart){
      cart = new Cart({__userId: userId, products:[]});
      cart  = await cart.save();
    }

    req.cart = cart
    next();
  }catch(err){
    res.status(400).json({success:false, message:`Failed to access Cart`})
  }
})




router.route('/users')
.get((req, res)=>{
  let {cart} = req;
  res.status(200).json({success:true, data:cart})
})
.post(async (req, res)=>{
  try{;
    let {cart} = req;
    let {__product, quantity, action} = req.body;

    let statusCode;

    const productInCart = cart.products.some((productObj) => productObj.__product == __product)


    if(productInCart){
      statusCode = 200;

      for(let product of cart.products){
        if(product.__product == __product){
          switch(action){
            case 'INCREMENT' : 
              product.quantity = product.quantity + 1;
              break;
            case 'DECREMENT' :
              product.quantity = product.quantity - 1;
              break;
          }
        }

      }
        
    }else{
      statusCode = 201;
      cart.products.push({__product, quantity:1})
    }

    cart = await cart.save();

    res.status(statusCode).json({success:true, data:cart})
  }catch(err){
    res.status(500).json({success:false, message:'Failed to Add Product'})
  }
})
.delete(async (req, res) =>{
  try{
      let {__product} = req.body;
      let {cart} = req;

      cart.products = cart.products.filter(product => product.__product != __product);

      cart = await cart.save();

      res.status(200).json({messag:'work in progress', data: cart})
  }catch(err){
    res.status(500).json({success:false, message:'Failed to remove product'})
  }
})


module.exports = router

