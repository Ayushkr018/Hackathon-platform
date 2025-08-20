const mongoose = require('mongoose');

const announcementSchema = new mongoose.Schema({
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
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

module.exports = mongoose.model('Announcement', announcementSchema);
