const express = require('express');
const {
  getEventSubmissions,
  assignJudge
} = require('../controllers/organizercontroller');
const { protect, restrictTo } = require('../middlewares/auth');

const router = express.Router();

// All routes below are protected and restricted to organizers
router.use(protect, restrictTo('organizer'));

// Route to get all submissions for a specific event
router.get('/events/:eventId/submissions', getEventSubmissions);

// Route to assign a judge to an event
router.post('/events/:eventId/judges', assignJudge);

module.exports = router;
