const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/User');

router.post('/signup', async (req, res) => {
  const { name, image, dob, role, email, phoneNumber, password } = req.body;

  if (!name || !image || !dob || !role || !email || !phoneNumber || !password) return res.status(400).send({ message: "Please provide proper data for register" });

  try {

    // Check if a user with the same email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).send({ message: 'User with this email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newAdmin = new User({
      name,
      image,
      dob,
      role,
      email,
      phoneNumber,
      password: hashedPassword,
    });

    await newAdmin.save();
    res.status(201).send({ message: 'User registered successfully' });
  } catch (error) {
    console.log({ error })
    res.status(500).send({ message: 'Server error' });
  }
});

router.post('/login', async (req, res) => {
  const { name, password: pwd } = req.body;

  if (!name || !pwd) return res.status(400).send({ message: "Please provide proper data for register" });

  try {
    const user = await User.findOne({ name });

    if (!user || !bcrypt.compareSync(pwd, user.password)) {
      return res.status(401).send({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user._id }, 'secretKey', {expiresIn: '7d'});
    const { password, ...userCred } = user._doc;
    res.send({ user: { token, ...userCred }, message: "Login successful." });
  } catch (error) {
    res.status(500).send({ message: 'Server error' });
    console.log(error)
  }
});

module.exports = router;
