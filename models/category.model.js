const mongoose = require('mongoose');
const {Schema} = mongoose;

const CategorySchema = new Schema({
  name:{
    type:String,
    required : [true, 'Category name cannot be empty']
  },
  imgUrl : {
    type: String ,
    required:true
  }
},
{
  timestamps: true
})

const Category = mongoose.model('Category', CategorySchema);

module.exports = {Category}