const mongoose = require('mongoose');
const {Schema} = mongoose;

const {User} = require('./user.model.js')
const {Product} = require('./product.model.js')

const CartProductArraySchema = new Schema({
  __product:{
    type:Schema.Types.ObjectId,
    ref:'Product'
  },
  quantity:{
    type:Number
  }
})

const CartSchema = new Schema({
  __userId:{
    type: Schema.Types.ObjectId, 
    ref:'User',
    required:true
  },

  products :{
    type:[CartProductArraySchema],
    default:undefined
  }

},
{
  timestamps:true
})

const Cart = mongoose.model('Cart', CartSchema);

module.exports = {Cart}



  // products : [{
  //   product:{
  //     type:Schema.Types.ObjectId,
  //     ref:'Product'
  //   },

  //   quantity:{
  //     type:Number
  //   }
  // }]