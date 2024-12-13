const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // Ensure bcrypt is imported here

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    yearOfStudy: { type: String, enum: ['1st year', '2nd year'], required: true },
    role: { type: String, enum: ['admin', 'user'], default: 'user' }, // Added role field
});

// Hash password before saving the user
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();

    try {
        const salt = await bcrypt.genSalt(10); // Generate salt
        this.password = await bcrypt.hash(this.password, salt); // Hash the password
        next();
    } catch (error) {
        next(error); // Pass errors to the next middleware
    }
});

module.exports = mongoose.model('User', userSchema);
