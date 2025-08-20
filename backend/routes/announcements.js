const express = require('express');
const {
  createAnnouncement,
  getEventAnnouncements
} = require('../controllers/announcementcontroller');
const { protect, restrictTo } = require('../middlewares/auth');

const router = express.Router({ mergeParams: true });

// Route to get all announcements for a specific event (e.g., /api/events/:eventId/announcements)
router.route('/')
    .get(getEventAnnouncements);

// Route to create a new announcement
router.post('/', protect, restrictTo('organizer'), createAnnouncement);

module.exports = router;
