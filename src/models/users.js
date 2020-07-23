const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  name: String,
  lastName: String,
  profilePic: String,
  email: String,
  cellphone: Number,
  password: String,
  type: String,
  cart: [
    {
      productId: String,
      amount: Number,
      addDate: String
    }
  ],
  buyed: [
    {
      shopId: String,
      productId: String,
      amount: Number
    }
  ],
  whishlist: [{ productId: String, addDate: String }]
})

module.exports = mongoose.model('userCad', userSchema)
