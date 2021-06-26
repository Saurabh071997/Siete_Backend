const mongoose = require('mongoose')
const {Schema} = mongoose

const AddressObjectSchema = new Schema({
  address:{
    type:String
  },

  locality: {
    type:String
  },

  city: {
    type: String
  },

  state: {
    type: String
  },

  country: {
    type: String
  },

  pincode: {
    type: String
  },

  isSelected: {
    type:Boolean
  }
})

const AddressSchema = new Schema({
  __userId:{
    type: Schema.Types.ObjectId, 
    ref:'User',
    required:true
  },

  addresslist:{
    type: [AddressObjectSchema],
    default: undefined
  },

},
{
  timestamps: true
})


const Address = mongoose.model('Address', AddressSchema)

module.exports = {Address}
