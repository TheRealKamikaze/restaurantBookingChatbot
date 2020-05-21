let mongoose = require('mongoose');

let bookingSchema = new mongoose.Schema({
  name: String,
  guests: Number,
  dateTime: String
})

module.exports = mongoose.model('booking', bookingSchema);
