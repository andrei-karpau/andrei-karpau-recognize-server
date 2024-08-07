const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const uniqueEmail = require('mongoose-unique-validator');

const userSchema = new Schema({
  username: { type: String, require: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, minlength: 8 },
});

userSchema.plugin(uniqueEmail);

module.exports = mongoose.model('userCollection', userSchema);