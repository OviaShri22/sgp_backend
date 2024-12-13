const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const FacultySchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  expertise: { type: String, required: true },
  password: { type: String, required: true }, // Add a password field
  dateAdded: { type: Date, default: Date.now }
});

// Hash password before saving Faculty
FacultySchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});
module.exports = mongoose.model('Faculty', FacultySchema);
