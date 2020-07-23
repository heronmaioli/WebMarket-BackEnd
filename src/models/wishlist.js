const mongoose = require('mongoose')

const wishlistSchema = new mongoose.Schema({
  userId: String,
  products: [
    {
      productId: String,
      addPrice: Number,
      addDate: String
    }
  ]
})

module.exports = mongoose.model('wishlist', wishlistSchema)
