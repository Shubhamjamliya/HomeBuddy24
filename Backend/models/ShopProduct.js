const mongoose = require('mongoose');

const shopProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true
  },
  description: String,
  price: {
    type: Number,
    required: [true, 'Product price is required']
  },
  originalPrice: Number,
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ShopCategory',
    required: [true, 'Category is required']
  },
  image: {
    type: String,
    required: [true, 'Product image is required']
  },
  images: [String],
  stock: {
    type: Number,
    default: 0
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  reviewsCount: {
    type: Number,
    default: 0
  },
  tag: {
    type: String,
    trim: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Create index for faster search
shopProductSchema.index({ name: 'text', description: 'text' });
shopProductSchema.index({ category: 1 });

module.exports = mongoose.model('ShopProduct', shopProductSchema);
