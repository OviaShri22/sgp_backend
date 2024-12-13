const express = require('express');
const router = express.Router();
const Faculty = require('../models/Faculty');
const Complaint = require('../models/Complaint');  // Import the Complaint model
const bcrypt = require('bcryptjs');

// Route to add a Faculty
router.post('/', async (req, res) => {
  const { name, email, password, expertise } = req.body;

  try {
    const newFaculty = new Faculty({
      name,
      email,
      password,
      expertise
    });
    await newFaculty.save();
    res.status(201).json({ message: 'Faculty added successfully' });
  } catch (error) {
    console.error('Error adding Faculty:', error);
    res.status(500).json({ message: 'Failed to add Faculty' });
  }
});

// Route for Faculty login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const faculty = await Faculty.findOne({ email });
    if (!faculty) {
      return res.status(404).json({ message: 'Faculty not found' });
    }

    const isMatch = await bcrypt.compare(password, faculty.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    res.status(200).json({
      message: 'Login successful',
      facultyId: faculty._id
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Route to fetch all Faculties
router.get('/', async (req, res) => {
  try {
    const faculties = await Faculty.find();
    res.status(200).json(faculties);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// New route to fetch complaints assigned to a specific Faculty
router.get('/complaints', async (req, res) => {
  const { facultyId } = req.query;
  try {
    // Fetch complaints assigned to the specified Faculty
    const complaints = await Complaint.find({ assignedFaculty: facultyId }).populate('assignedFaculty');
    
    if (!complaints || complaints.length === 0) {
      return res.status(404).json({ message: 'No complaints found for this Faculty.' });
    }

    res.status(200).json(complaints);
  } catch (error) {
    console.error('Error fetching Faculty complaints:', error);
    res.status(500).json({ message: 'Server error while fetching complaints.', error });
  }
});




module.exports = router;
