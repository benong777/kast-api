const User = require('../models/User');
const { StatusCodes } = require('http-status-codes');
const { BadRequestError, UnauthenticatedError } = require('../errors');

const register = async (req, res) => {
  //-- Create User
  const user = await User.create({ ...req.body });
  //-- Invoke the Mongoose Schema instance method (createJWT) created in the models/User.js to get the token
  const token = user.createJWT();

  res.status(StatusCodes.CREATED).json({ 
      user: { name: user.name },
      token
  });
}

const login = async (req, res) => {
  const { email, password } = req.body;

  //-- Ensure credentials are not empty strings
  if (!email || !password) {
    throw new BadRequestError('Please provide email and password.');
  }

  const user = await User.findOne({ email });

  //-- Check if user exists
  if (!user) {
    throw new UnauthenticatedError('Invalid credentials.');
  }

  //-- Check if password is correct using the UserSchema instance method 'comparePassword' in models/User.js
  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new UnauthenticatedError('Invalid credentials.');
  }

  //-- Got user: create token (createJWT method is from models/User)
  const token = user.createJWT();

  res.status(StatusCodes.OK).json({ 
      user: { name: user.name, userId: user._id },
      token
  });
}

module.exports = { register, login };