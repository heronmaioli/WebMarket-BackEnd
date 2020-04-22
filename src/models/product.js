const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
  userId: String,
  photo: String,
  title: String,
  description: String,
  value: Number,
  clicks: Number,
  countStorage: Number,
  buyed: Number
})

module.exports = mongoose.model('Product', productSchema)
