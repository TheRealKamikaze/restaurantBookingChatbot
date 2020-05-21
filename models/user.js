let mongoose = require('mongoose');

let userSchema = new mongoose.Schema({
  name: String,
  sessionId: String
})

module.exports = mongoose.model('user', userSchema);
