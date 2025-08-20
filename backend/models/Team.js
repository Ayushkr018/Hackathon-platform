const mongoose = require('mongoose');

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
    unique: true,
    required: true
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
  if (!this.inviteCode) {
    this.inviteCode = Math.random().toString(36).substring(2, 15) + 
                     Math.random().toString(36).substring(2, 15);
  }
  next();
});

// Ensure team leader is in members array
teamSchema.pre('save', function(next) {
  const leaderInMembers = this.members.some(member => 
    member.user.toString() === this.leaderId.toString()
  );
  
  if (!leaderInMembers) {
    this.members.push({
      user: this.leaderId,
      role: 'leader'
    });
  }
  next();
});

module.exports = mongoose.model('Team', teamSchema);
