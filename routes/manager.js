const express = require('express');
const managerRoutes = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/User');
const { authorize } = require('../middleware/authorize.middleware');


managerRoutes.use(authorize(['admin']))

managerRoutes.post('/',  async (req, res) => {
  const { name, image, dob, email, role, phoneNumber, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      image,
      dob,
      email,
      role,
      phoneNumber,
      password: hashedPassword
    });

    await newUser.save();

    res.status(201).send({ message: 'Manager created successfully' });
  } catch (error) {
    console.log('error:', error)
    res.status(500).send({ message: 'Server error' });
  }
});

managerRoutes.get('/', async (req, res) => {
  try {
    const users = await User.find({ role: 'manager' });
    res.send({ users, message: "Get data successfully" });
  } catch (error) {
    res.status(500).send({ message: 'Server error' });
  }
});

managerRoutes.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await User.findByIdAndDelete(id);
    res.status(200).send({ message: 'Manager deleted successfully' });
  } catch (error) {
    res.status(500).send({ message: 'Server error' });
  }
});

managerRoutes.patch('/:id', async (req, res) => {
  const { id } = req.params;
  const update = req.body;

  try {
    await User.findByIdAndUpdate(id, update, { runValidators: true });
    res.status(200).send({ message: 'Manager update successfully' });
  } catch (error) {
    res.status(500).send({ message: 'Server error' });
  }
});


module.exports = managerRoutes;
