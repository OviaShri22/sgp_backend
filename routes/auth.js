const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Login Route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Generate token including user's role (admin or user)
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      'your_jwt_secret',
      { expiresIn: '1h' }
    );

    // Send the token and user details to the frontend
    res.json({ 
      token, 
      user: { 
        name: user.name, 
        email: user.email, 
        role: user.role 
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
