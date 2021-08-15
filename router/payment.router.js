require('dotenv').config()
const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
const { v4: uuid } = require('uuid');
const {authenticateToken} = require('../utils/authenticateToken.js')
const {User} = require('../models/user.model.js')
const {Cart} = require('../models/cart.model.js')

const router = express.Router()

router.use('/', authenticateToken)

router.route('/')
.post(async (req, res) => {
   try{
      const {userId} = req
      const user = await User.findById(userId);
      const {token, cart} = req.body


      const idempotencyKey = uuid()
    
      return stripe.customers.create({
        email: user.email,
        source: token.id
      }).then(customer => {
        stripe.charges.create({
          amount: cart.total*100,
          currency:"inr",
          customer: customer.id
        },{idempotencyKey})
      }).then( async (result) => {
        let userCart = await Cart.findOne({__userId: userId})
        userCart.products = []
        userCart = await userCart.save()
        res.status(200).json({success:true, data: result})
      }).catch(err => {
        res.status(500).json({success:false, message:"Payment Failed", errorMessage:err.message})
      })  

   }catch(err){
     res.status(500).json({success:false, message:"Payment Failed", errorMessage:err.message})
   }
})

module.exports = router