const mongoose = require('mongoose');
const { getStructuredDB } = require('../config/database');

const teamSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Team name is required'],
    trim: true,
    maxlength: [50, 'Team name cannot be more than 50 characters']
  },
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true
  },
  members: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    joinedAt: {
      type: Date,
      default: Date.now
    },
    role: {
      type: String,
      enum: ['leader', 'member'],
      default: 'member'
    }
  }],
  leaderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  inviteCode: {
    type: String,
    unique: true
  },
  description: {
    type: String,
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  lookingForMembers: {
    type: Boolean,
    default: false
  },
  requiredSkills: [String],
  status: {
    type: String,
    enum: ['active', 'inactive', 'disbanded'],
    default: 'active'
  }
}, {
  timestamps: true
});

// Generate unique invite code before saving
teamSchema.pre('save', function(next) {
  if (this.isNew && !this.inviteCode) {
    this.inviteCode = Math.random().toString(36).substring(2, 10) +
                      Math.random().toString(36).substring(2, 10);
  }
  next();
});

// Ensure team leader is in members array
teamSchema.pre('save', function(next) {
  if (this.isModified('leaderId') || this.isNew) {
    const leaderInMembers = this.members.some(member =>
      member.user.equals(this.leaderId)
    );

    if (!leaderInMembers) {
      // Remove any old leader roles
      this.members.forEach(member => {
        if (member.role === 'leader') {
          member.role = 'member';
        }
      });
      // Add the new leader
      this.members.push({
        user: this.leaderId,
        role: 'leader'
      });
    }
  }
  next();
});

const db = getStructuredDB();

const Team = db.model('Team', teamSchema);

module.exports = Team;