const mongoose = require('mongoose');

const shopOrderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User is required']
  },
  orderNumber: {
    type: String,
    unique: true,
    required: true
  },
  items: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ShopProduct',
        required: true
      },
      name: String,
      price: Number,
      quantity: {
        type: Number,
        required: true,
        min: 1
      },
      image: String
    }
  ],
  totalAmount: {
    type: Number,
    required: true
  },
  subtotal: Number,
  tax: Number,
  shipping: {
    type: Number,
    default: 0
  },
  shippingAddress: {
    email: String,
    phone: String,
    addressLine: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  paymentMethod: {
    type: String,
    required: true,
    enum: ['card', 'cod', 'bank']
  },
  paymentStatus: {
    type: String,
    enum: ['Pending', 'Paid', 'Failed', 'Refunded'],
    default: 'Pending'
  },
  orderStatus: {
    type: String,
    enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
    default: 'Pending'
  },
  trackingNumber: String,
  couponCode: String,
  discountAmount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

shopOrderSchema.index({ user: 1, createdAt: -1 });
shopOrderSchema.index({ orderNumber: 1 });

module.exports = mongoose.model('ShopOrder', shopOrderSchema);
