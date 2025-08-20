const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { getStructuredDB } = require('../config/database'); 

const userSchema = new mongoose.Schema({
  
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [50, 'Name cannot be more than 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please add a valid email']
  },
  passwordHash: {
    type: String,
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },
  role: {
    type: String,
    enum: ['participant', 'organizer', 'judge', 'admin'],
    default: 'participant'
  },
  socialId: {
    google: String,
    github: String
  },
  avatar: {
    type: String,
    default: null
  },
  bio: {
    type: String,
    maxlength: [500, 'Bio cannot be more than 500 characters']
  },
  skills: [String],
  isVerified: {
    type: Boolean,
    default: false
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date
}, {
  timestamps: true
});


userSchema.pre('save', async function(next) {
  if (!this.isModified('passwordHash') || !this.passwordHash) return next();
  
  this.passwordHash = await bcrypt.hash(this.passwordHash, 12);
  next();
});

userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.passwordHash);
};

userSchema.methods.toJSON = function() {
  const user = this.toObject();
  delete user.passwordHash;
  delete user.resetPasswordToken;
  delete user.resetPasswordExpire;
  return user;
};

const db = getStructuredDB();

const User = db.model('User', userSchema);

module.exports = User;