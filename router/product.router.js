const express = require('express');
const {extend} = require('lodash');
const {Product} = require('../models/product.model.js')

const router = express.Router();

router.route('/')
.get(async(req, res) => {
  try{
    const products = await Product.find({}).populate({
      path:'subcategory',
      populate:{
        path:'category'
      }
    })

    res.status(200).json({success:true, data: products})
  }catch(err){
    res.status(500).json({success:false, errorMessage:'Failed to access data'});
  }
})
.post(async (req, res) =>{
  try{
    const newProductObj = req.body;
    const newProduct = new Product(newProductObj);
    const savedData = await newProduct.save();
    res.status(201).json({success:true, data: savedData})
  }catch(err){
     res.status(500).json({success:false, errorMessage:err.message})
  }
})


router.param('productId', async (req, res, next, productId) =>{
  try{

    const product = await Product.findById(productId).populate({
      path:'subcategory',
      populate : {
        path:'category'
      }
    })

    if(!product){
      return res.status(400).json({success:false, message: `No Product with id ${productId} exists`})
    }

    req.product = product;

    next();
  }catch(err){
    res.status(400).json({success:false, message: `No Product with id ${productId} exists`})
  }
})

router.route('/:productId')
.get((req, res)=>{
  let {product} = req;

  product.__v = undefined;
  res.status(200).json({success:true, data: product})
})
.post(async (req, res)=>{
  const productUpdate = req.body;
  let {product} = req;

  product = extend(product, productUpdate);
  product = await product.save();

  res.json({success:true, data: product})  
})
.delete(async(req, res)=>{
  let {product} = req;

  product = await product.remove();

  product.deleted = true;

  res.json({success:true, deleted_data: product})
})



module.exports = router