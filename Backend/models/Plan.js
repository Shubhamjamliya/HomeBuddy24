const mongoose = require('mongoose');

const PlanSchema = new mongoose.Schema({
  name: {
    type: String, // Silver, Gold, etc.
    required: [true, 'Plan name is required'],
    unique: true,
    trim: true
  },
  price: {
    type: Number,
    required: [true, 'Plan price is required']
  },
  services: {
    type: [String], // Array of service strings e.g. ["(1+1) basic services", "Support 24/7"]
    default: []
  },
  freeCategories: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category'
  }],
  freeServices: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service'
  }],
  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Plan', PlanSchema);
