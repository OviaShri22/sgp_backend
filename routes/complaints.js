const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Complaint = require('../models/Complaint');
const Faculty = require('../models/Faculty');
const multer = require('multer');
const cors = require('cors');
const path = require('path');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/documents/'); // Make sure this directory exists
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

// Function to determine severity
const determineSeverity = (complaintText) => {
  if (complaintText.includes('ragging') || complaintText.includes('cannot understand') || complaintText.includes('Ragging')) {
    return 'High';
  } else if (complaintText.includes('not available') || complaintText.includes('scholarship')) {
    return 'Medium';
  } else {
    return 'Low';
  }
};

// GET /api/complaints - Fetch complaints (all or by email)
router.get('/', async (req, res) => {
  try {
    const { email } = req.query;
    if (email) {
      const studentComplaints = await Complaint.find({ email });
      return res.status(200).json(studentComplaints);
    }
    const allComplaints = await Complaint.find().populate('assignedFaculty');
    res.status(200).json(allComplaints);
  } catch (error) {
    console.error('Error fetching complaints:', error);
    res.status(500).json({ message: 'Error fetching complaints', error });
  }
});

// GET /api/complaints/:id - Fetch a single complaint by ID
router.get('/:id', async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id).populate('assignedFaculty');
    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }
    res.status(200).json(complaint);
  } catch (error) {
    console.error('Error fetching complaint:', error);
    res.status(500).json({ message: 'Error fetching complaint', error });
  }
});

// POST /api/complaints - Create a new complaint with file upload
router.post('/', upload.single('document'), async (req, res) => {
  try {
    const { rollNo, email, type, expertise, complaint, anonymous } = req.body;

    // Check if anonymous checkbox is checked (present in request body)
    const isAnonymous = anonymous === 'true' || anonymous === true; // Consider different ways users might indicate being anonymous

    const severity = determineSeverity(complaint);
    const newComplaint = new Complaint({
      rollNo: rollNo ,
      email: email,
      type,
      expertise,
      complaint,
      severity,
      status: 'Complaint Raised',
      document: req.file ? path.join('uploads/documents/', req.file.filename) : null,
      anonymous: isAnonymous,
    });

    await newComplaint.save();
    res.status(201).json(newComplaint);
  } catch (error) {
    console.error('Error creating complaint:', error);
    res.status(500).json({ message: 'Error creating complaint', error });
  }
});
// PUT /api/complaints/:id - Assign a faculty to a complaint
router.put('/:id', async (req, res) => {
  const complaintId = req.params.id;
  const { assignedFaculty } = req.body;
  try {
    const updatedComplaint = await Complaint.findByIdAndUpdate(
      complaintId,
      {
        assignedFaculty,
        assignedAt: new Date()
      },
      { new: true }
    ).populate('assignedFaculty');

    if (!updatedComplaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }
    res.status(200).json(updatedComplaint);
  } catch (error) {
    console.error('Error assigning faculty:', error);
    res.status(500).json({ message: 'Error assigning Faculty', error });
  }
});

// PUT /api/complaints/status/:id - Update complaint status
router.put('/status/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const updatedComplaint = await Complaint.findByIdAndUpdate(id, { status }, { new: true });
    if (!updatedComplaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }
    res.json(updatedComplaint);
  } catch (error) {
    console.error('Error updating complaint status:', error);
    res.status(500).json({ message: 'Error updating complaint status', error });
  }
});

// DELETE /api/complaints/:id - Delete a complaint by ID
router.delete('/:id', async (req, res) => {
  try {
    const deletedComplaint = await Complaint.findByIdAndDelete(req.params.id);
    if (!deletedComplaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }
    res.status(200).json({ message: 'Complaint deleted successfully' });
  } catch (error) {
    console.error('Error deleting complaint:', error);
    res.status(500).json({ message: 'Error deleting complaint', error });
  }
});

module.exports = router;