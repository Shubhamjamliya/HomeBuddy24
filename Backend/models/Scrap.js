const mongoose = require('mongoose');

const scrapSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  category: {
    type: String,
    enum: ['AC', 'Fridge', 'Washing Machine', 'Geyser', 'RO', 'Cooler', 'Microwave', 'TV', 'Other Appliance'],
    default: 'Other Appliance'
  },
  quantity: {
    type: String, // e.g. "5 kg"
    required: true
  },
  expectedPrice: {
    type: Number,
    default: 0
  },
  images: [{
    type: String
  }],
  address: {
    addressLine1: String,
    city: String,
    state: String,
    pincode: String,
    lat: Number,
    lng: Number
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'completed', 'cancelled'],
    default: 'pending',
    index: true
  },
  vendorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vendor',
    default: null
  },
  pickupDate: {
    type: Date
  },
  finalPrice: {
    type: Number
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Scrap', scrapSchema);
