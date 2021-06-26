const mongoose = require('mongoose')
const {Schema} = mongoose;

const UserSchema = new Schema({
  firstname:{
    type:String
  },

  lastname:{
    type:String
  },

  email:{
    type:String,
    required:[true, 'Email Required'],
    unique: [true, 'Email must be unique']
  },

  password:{
    type:String,
    required:[true, 'Password Required']
  },

  contact:{
    type:String
  }
},
{
  timestamps: true
})

const User = mongoose.model('User', UserSchema);

module.exports = {User}