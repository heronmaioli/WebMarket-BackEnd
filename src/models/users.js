const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  name: String,
  lastName: String,
  profilePic: String,
  email: String,
  cellphone: Number,
  password: String,
  type: String
})

module.exports = mongoose.model('userCad', userSchema)
