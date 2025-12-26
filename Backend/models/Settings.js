const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  type: {
    type: String,
    default: 'global',
    unique: true
  },
  visitedCharges: {
    type: Number,
    default: 0,
    min: 0
  },
  gstPercentage: {
    type: Number,
    default: 18,
    min: 0,
    max: 100
  },
  // Future extensible fields
  currency: {
    type: String,
    default: 'INR'
  }
}, { timestamps: true });

module.exports = mongoose.model('Settings', settingsSchema);
