const express = require('express');
const {extend} = require('lodash');
const {SubCategory} = require('../models/subcategory.model.js')

const router = express.Router();

router.route('/')
.get(async (req, res) => {
  try{
    const subcategories = await SubCategory.find({}).populate('category');
    res.status(200).json({success:true, data: subcategories})
  }catch(err){
    res.status(500).json({success:false, errorMessage:'Failed to access data'});
  }
})
.post(async (req, res)=>{
  try{
     const newSubCategoryObj = req.body
     const newSubCategory = new SubCategory(newSubCategoryObj);
     const savedData = await newSubCategory.save();
     res.status(201).json({success:true, data: savedData})
  }catch(err){
     res.status(500).json({success:false, errorMessage:err.message})
  }
})


router.param('subcategoryId', async (req, res, next, subcategoryId) =>{
  try{
    // const subcategory = await SubCategory.findById(subcategoryId);
    const subcategory = await SubCategory.findById(subcategoryId).populate('category')

    if(!subcategory){
      return res.status(400).json({success:false, message: `No SubCategory with id ${subcategoryId} exists`})
    }

    req.subcategory = subcategory;

    next();
  }catch(err){
    res.status(400).json({success:false, message: `No SubCategory with id ${subcategoryId} exists`})
  }
})

router.route('/:subcategoryId')
.get((req, res)=>{
  let {subcategory} = req;

  subcategory.__v = undefined;
  res.status(200).json({success:true, data: subcategory})
})
.post(async (req, res)=>{
  const subcategoryUpdate = req.body;
  let {subcategory} = req;

  subcategory = extend(subcategory, subcategoryUpdate);
  subcategory = await subcategory.save();

  res.json({success:true, data: subcategory})  
})
.delete(async(req, res)=>{
  let {subcategory} = req;

  subcategory = await subcategory.remove();

  subcategory.deleted = true;

  res.json({success:true, deleted_data: subcategory})
})

module.exports = router;