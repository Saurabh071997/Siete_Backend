const mongoose = require('mongoose')
const {Schema} = mongoose;

const UserSchema = new Schema({
  firstname:{
    type:String, 
    required:[true, 'FirstName Required']
  },

  lastname:{
    type:String, 
    required:[true, 'LastName Required']
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
    type:String,
    required:true
  }
})

const User = mongoose.model('User', UserSchema);

module.exports = {User}