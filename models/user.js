const {model, Schema} = require('mongoose');

const User = new Schema({
  email: {type: String, required: true, unique: true},
  password: {type: String, required: true},
  isActivated: {type: Boolean, default: false},
  activationLink: {type: String, default: ''},
})

module.exports = model('User', User);
