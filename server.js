const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const path = require('path');

// MongoDB connection
mongoose.connect('mongodb+srv://oviashriv:oviashriv_1@sgp.93dhj.mongodb.net/?retryWrites=true&w=majority&appName=SGP', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Middleware
app.use(cors());
app.use(bodyParser.json());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// Routes
const usersRoute = require('./routes/users');
const authRoute = require('./routes/auth');
const complaintsRoute = require('./routes/complaints');
const facultyRoute = require('./routes/faculties');  // Add this line to import the faculty route

// Use Routes
app.use('/api/users', usersRoute);
app.use('/api/auth', authRoute);
app.use('/api/complaints', complaintsRoute);
app.use('/api/faculties', facultyRoute);  // Add this line to register the faculty route

// Example route for fetching solved complaints
const Complaint = require('./models/Complaint');
app.get('/history', async (req, res) => {
  try {
    const solvedComplaints = await Complaint.find({ status: 'Grievance Solved' });
    if (!solvedComplaints || solvedComplaints.length === 0) {
      return res.status(404).json({ message: 'No solved complaints found' });
    }
    res.status(200).json(solvedComplaints);
  } catch (error) {
    console.error('Error fetching solved complaints:', error);
    res.status(500).json({ message: 'Error fetching solved complaints', error });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));