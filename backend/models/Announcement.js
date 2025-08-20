const mongoose = require('mongoose');

const { getUnstructuredDB } = require('../config/database');

const announcementSchema = new mongoose.Schema({
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event', // This will reference an Event in the 'structured' DB
    required: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // This will reference a User in the 'structured' DB
    required: true
  },
  title: {
    type: String,
    required: [true, 'Announcement title is required'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  content: {
    type: String,
    required: [true, 'Announcement content is required'],
    maxlength: [2000, 'Content cannot be more than 2000 characters']
  },
  targetAudience: {
    type: String,
    enum: ['all', 'participants', 'judges', 'teams'],
    default: 'all'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  isPublished: {
    type: Boolean,
    default: true
  },
  publishAt: {
    type: Date,
    default: Date.now
  },
  attachments: [{
    name: String,
    url: String
  }]
}, {
  timestamps: true
});

const db = getUnstructuredDB();

const Announcement = db.model('Announcement', announcementSchema);

module.exports = Announcement;