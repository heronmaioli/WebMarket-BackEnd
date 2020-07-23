const mongoose = require('mongoose')

const cartSchema = new mongoose.Schema({
  userId: String,
  products: [
    {
      productId: String,
      amount: Number,
      addTime: String,
      addPrice: Number
    }
  ]
})

module.exports = mongoose.model('cart', cartSchema)
