const mongoose = require('mongoose')
const {Schema} = mongoose;

const {SubCategory} = require('./subcategory.model.js');

const ProductSchema = new Schema ({
  name:{
    type:String,
    required:[true, 'Name required for the product']
  },
  imgUrl:{
    type:String,
    required: true
  },
  brandName :{
    type:String,
    required: [true, 'Brand-Name required for the product'],
  },
  newProduct:{
    type:Boolean,
    required:true
  },
  isDiscounted:{
    type:Boolean,
    required:true
  },
  discount:{
    type:Number,
    required:true
  },
  actualPrice:{
    type:Number,
    required:[true, 'Product should have a price value']
  },
  effectivePrice:{
    type:Number, 
    required:[true, 'Product should have a price value']
  },
  subcategory:{
    type:Schema.Types.ObjectId,
    ref:'SubCategory',
    required:true,
  }

},
{
  timestamps:true
})

const Product = mongoose.model('Product', ProductSchema)

module.exports = {Product}