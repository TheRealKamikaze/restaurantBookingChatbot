let mongoose = require('mongoose');

let bookingSchema = new mongoose.Schema({
  name: String,
  guests: Number,
  dateTime: Date
})

module.exports = mongoose.model('booking', bookingSchema);
