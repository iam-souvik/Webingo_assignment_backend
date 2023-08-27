const express = require('express');
const User_router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/User');
const { authorize } = require('../middleware/authorize.middleware');


User_router.use(authorize(['manager']));


User_router.post('/', async (req, res) => {
  const { name, image, dob, email, phoneNumber, password } = req.body;

  try {
    // Check if a user with the same email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).send({ message: 'User with this email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      image,
      dob,
      email,
      phoneNumber,
      password: hashedPassword,
    });

    await newUser.save();

    res.status(201).send({ message: 'User created successfully' });
  } catch (error) {
    console.log('error:', error)
    res.status(500).send({ message: 'Server error' });
  }
});


User_router.get('/', async (req, res) => {
  try {
    const users = await User.find({ role: 'user' });
    res.send({ users, message: "Get Data successful" });
  } catch (error) {
    console.log('error:', error)
    res.status(500).send({ message: 'Server error' });
  }
});

User_router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await User.findByIdAndDelete(id);
    res.status(200).send({ message: 'User deleted successfully' });
  } catch (error) {
    console.log('error:', error)
    res.status(500).send({ message: 'Server error' });
  }
});

User_router.patch('/:id', async (req, res) => {
  const { id } = req.params;
  const update = req.body;

  try {
    await User.findByIdAndUpdate(id, update, { runValidators: true });
    res.status(200).send({ message: 'User update successfully' });
  } catch (error) {
    console.log('error:', error)
    res.status(500).send({ message: 'Server error' });
  }
});


module.exports = User_router;
