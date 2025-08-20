const mongoose = require('mongoose');
// Import the function to get the structured database connection
const { getStructuredDB } = require('../config/database');

const projectSchema = new mongoose.Schema({
  teamId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team',
    required: true
  },
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true
  },
  round: {
    type: String,
    required: true,
    default: 'final'
  },
  title: {
    type: String,
    required: [true, 'Project title is required'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Project description is required'],
    maxlength: [2000, 'Description cannot be more than 2000 characters']
  },
  githubUrl: {
    type: String,
    match: [/^https:\/\/github\.com\/.*/, 'Please provide a valid GitHub URL']
  },
  liveUrl: {
    type: String,
    match: [/^https?:\/\/.*/, 'Please provide a valid URL']
  },
  videoUrl: {
    type: String,
    match: [/^https:\/\/(www\.)?(youtube\.com|youtu\.be|vimeo\.com)\/.*/, 'Please provide a valid video URL']
  },
  documentUrls: [{
    name: String,
    url: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  technologies: [String],
  themes: [String],
  submittedAt: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['draft', 'submitted', 'under_review', 'evaluated'],
    default: 'draft'
  },
  isDisqualified: {
    type: Boolean,
    default: false
  },
  disqualificationReason: String,
  screenshots: [String]
}, {
  timestamps: true
});

// Compound index for team-event-round uniqueness
projectSchema.index({ teamId: 1, eventId: 1, round: 1 }, { unique: true });

const db = getStructuredDB();

// Create and export the model on that specific connection
const Project = db.model('Project', projectSchema);

module.exports = Project;