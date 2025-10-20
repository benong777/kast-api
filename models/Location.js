const mongoose = require('mongoose');

const LocationSchema = new mongoose.Schema({
  _id: {
    type: String,  // Could also be Number, depending on your format
    required: true
  },
  name: {
    type: String,
    required: [true, 'Please provide a location name.'],
  },
  address: {
    type: String,
    required: [true, 'Please provide a location address.']
  }
}, { timestamps: true });

module.exports = mongoose.model('Location', LocationSchema);