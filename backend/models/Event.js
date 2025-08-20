const mongoose = require('mongoose');

const roundSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: String,
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  submissionRequired: {
    type: Boolean,
    default: true
  }
});

const eventSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Event name is required'],
    trim: true,
    maxlength: [100, 'Event name cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Event description is required'],
    maxlength: [2000, 'Description cannot be more than 2000 characters']
  },
  organizerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  startDate: {
    type: Date,
    required: [true, 'Start date is required']
  },
  endDate: {
    type: Date,
    required: [true, 'End date is required']
  },
  registrationDeadline: {
    type: Date,
    required: [true, 'Registration deadline is required']
  },
  rounds: [roundSchema],
  status: {
    type: String,
    enum: ['draft', 'published', 'ongoing', 'completed', 'cancelled'],
    default: 'draft'
  },
  maxTeamSize: {
    type: Number,
    required: true,
    min: [1, 'Team size must be at least 1'],
    max: [10, 'Team size cannot exceed 10']
  },
  minTeamSize: {
    type: Number,
    default: 1,
    min: 1
  },
  prizes: [{
    position: String,
    amount: Number,
    description: String
  }],
  rules: String,
  themes: [String],
  technologies: [String],
  banner: String,
  isPublic: {
    type: Boolean,
    default: true
  },
  registrationCount: {
    type: Number,
    default: 0
  },
  maxParticipants: {
    type: Number,
    default: null
  },
  judges: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]
}, {
  timestamps: true
});

// Validation: endDate should be after startDate
eventSchema.pre('save', function(next) {
  if (this.endDate <= this.startDate) {
    next(new Error('End date must be after start date'));
  }
  if (this.registrationDeadline >= this.startDate) {
    next(new Error('Registration deadline must be before start date'));
  }
  next();
});

module.exports = mongoose.model('Event', eventSchema);
