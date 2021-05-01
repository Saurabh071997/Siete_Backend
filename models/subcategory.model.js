const mongoose = require('mongoose')
const {Schema} = mongoose;

const {Category} = require('./category.model.js')

const  SubCategorySchema = new Schema({
  name:{
    type:String,
    required:[true, 'Name field cannot be empty']
  },

  imgUrl:{
    type:String
  },

  category :{
    type: Schema.Types.ObjectId, ref:'Category',
    required:true
  }
},
{
    timestamps: true
})

const SubCategory = mongoose.model('SubCategory', SubCategorySchema);

module.exports = {SubCategory}