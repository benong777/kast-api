const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    minlength: 3,
    maxLength: 50
  },
  email: {
    type: String,
    required: [true, 'Please provide email'],
    //-- Check email is valid
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      'Please provide a valid email',
    ],
    unique: true,
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 6,
  },
});

//-- Run this 'Pre' middleware to hash the password first
UserSchema.pre('save', async function() {   // * Use 'function' to scope document to 'this'
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

//-- Use UserSchema to create a new method (createJWT here) to create a token. See mongoose docs (Schemas/instance methods)
//-- Can create methods on the MongoDB document.
UserSchema.methods.createJWT = function () {
  return jwt.sign(
    { userId: this._id, name: this.name },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_LIFETIME }
  );
}

UserSchema.methods.comparePassword = async function(userEnteredPassword) {
  const isMatch = await bcrypt.compare(userEnteredPassword, this.password);
  return isMatch;
}

module.exports = mongoose.model('User', UserSchema);