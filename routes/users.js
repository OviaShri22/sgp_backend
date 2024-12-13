const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');

// Route to add multiple users
// Add Users Route
router.post('/add', async (req, res) => {
    const users = req.body;
  
    try {
      // Hash passwords for each user before saving them
      for (let user of users) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
      }
  
      await User.insertMany(users);
      res.status(201).json({ message: 'Users added successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Failed to add users', error });
    }
  });
  
// Route to add an admin
// router.post('/add-admin', async (req, res) => {
//     const { email, password } = req.body;

//     try {
//         const salt = await bcrypt.genSalt(10);
//         const hashedPassword = await bcrypt.hash(password, salt);

//         const newAdmin = new User({
//             email,
//             password: hashedPassword,
//             role: 'admin'  // Set role to admin
//         });

//         await newAdmin.save();
//         res.status(201).json({ message: 'Admin added successfully' });
//     } catch (error) {
//         res.status(500).json({ message: 'Failed to add admin', error });
//     }
// });

// Route to fetch all users
router.get('/', async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching users' });
    }
});

// Route to delete a user by ID
router.delete('/:id', async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting user' });
    }
});

module.exports = router;
