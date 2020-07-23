const mongoose = require('mongoose')

const buyedSchema = new mongoose.Schema({
  userId: String,
  buyed: [
    {
      order: String,
      orderDate: String,
      products: {
        productId: String,
        amount: Number,
        price: Number
      }
    }
  ]
})
module.exports = mongoose.model('buyed', buyedSchema)
