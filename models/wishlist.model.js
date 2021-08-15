const mongoose = require('mongoose');
const {Schema} = mongoose;

const {User} = require('./user.model.js')
const {Product} = require('./product.model.js')

const WishlistProductArraySchema = new Schema({
  __product : {
    type : Schema.Types.ObjectId,
    ref : 'Product'
  }

})

const WishlistSchema = new Schema({
  __userId : {
    type: Schema.Types.ObjectId, 
    ref:'User',
    required:true
  },

  products : {
    type:[WishlistProductArraySchema],
    default:undefined
  }

},
{
  timestamps:true
})

const Wishlist = mongoose.model('Wishlist', WishlistSchema);

module.exports = {Wishlist}

