const mongoose = require('mongoose');

const ComplaintSchema = new mongoose.Schema({
  rollNo: String,
  email: String,
  type: String,
  expertise: String,
  complaint: String,
  severity: { type: String, default: 'Low' },
  status: { type: String, default: 'Complaint Raised' },
  assignedFaculty: { type: mongoose.Schema.Types.ObjectId, ref: 'Faculty' }, // Reference to the Faculty model
  assignedAt: Date,
  createdAt: { type: Date, default: Date.now },
  document: {type: String},
  anonymous: {type: Boolean, default:false},
});


const Complaint = mongoose.model('Complaint', ComplaintSchema);

module.exports = Complaint;