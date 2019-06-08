var mongoose = require('mongoose')

var Schema = mongoose.Schema

exports.User = mongoose.model('User', new Schema({
  first: String,
  last: String,
  // email: { type: String, unique: true },
  email: { type: String, unique: false },
  password: { type: String, index: true }
}))