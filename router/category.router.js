const express = require('express');
const {extend} = require('lodash');
const {Category} = require('../models/category.model.js')

const router = express.Router();

const subcategories_router = require('./subcategory.router.js');

router.use('/subcategory', subcategories_router);

router.route('/')
.get(async (req, res) =>{
  try{
    const categories = await Category.find({});
    res.status(200).json({success:true, data: categories})
  }catch(err){
    res.status(500).json({success:false, errorMessage:'Failed to access data'});
  }
})
.post(async (req, res) =>{
  try{
     const newCategoryObj = req.body
     const newCategory = new Category(newCategoryObj);
     const savedData = await newCategory.save();
     res.status(201).json({success:true, data: savedData})
  }catch(err){
     res.status(500).json({success:false, errorMessage:err.message})
  }
})



router.param('categoryId', async (req, res, next, categoryId) =>{
  try{
    const category = await Category.findById(categoryId);
  
    if(!category){
      return res.status(400).json({success:false, message: `No Category with id ${categoryId} exists`})
    }

    req.category = category;

    next();
  }catch(err){
    res.status(400).json({success:false, message:`No Category with id ${categoryId} exists`})
  }
})

router.route('/:categoryId')
.get((req, res)=>{
  let {category} = req;
  category.__v = undefined;
  res.status(200).json({success:true , data: category })
})
.post(async (req, res)=>{
  const categoryUpdate = req.body;
  let {category} = req;

  category = extend(category, categoryUpdate);
  category = await category.save();

  res.json({success:true, data: category})  
})
.delete(async (req, res)=>{
  let {category} = req;

  category = await category.remove();

  category.deleted = true;

  res.json({success:true, deleted_data: category})
})



module.exports = router;