const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
require('dotenv').config();

// Register a new user
const registerUser = async (req, res) => {
  // Check if username already exists
  const existingUser = await User.findOne({ username: req.body.username });
  if (existingUser) {
    return res.status(400).send({ message: 'Username already exists' });
  }

  // Create new user
  const user = new User(req.body);
  try {
    await user.save();
    // Generate token
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
    res.status(201).send({ user, token });
  } catch (err) {
    res.status(400).send(err);
  }
};

// User login
const loginUser = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
      throw new Error('Invalid credentials');
    }
    // Generate token
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
    res.send({ user, token });
  } catch (err) {
    res.status(400).send({ error: 'Invalid credentials' });
  }
};

module.exports = {
  registerUser,
  loginUser
};
