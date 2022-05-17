const mongoose = require('mongoose')

const Schema = mongoose.Schema

const orderSchema = new Schema({
  user: {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    email: {
      type: Schema.Types.String,
      ref: 'User',
      required: true
    }
  },
  products: [{
    product: {
      product_id: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
      },
      title: {
        type: Schema.Types.String,
        ref: 'Product',
        required: true
      },
      price: {
        type: Schema.Types.Number,
        ref: 'Product',
        required: true
      },
      // ref: 'Product',
    },
    quantity: {
      type: Number,
      required: true,
    }
  }]
})

module.exports = mongoose.model('Order', orderSchema)