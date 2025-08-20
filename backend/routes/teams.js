const express = require('express');
const {
  createTeam,
  getEventTeams
} = require('../controllers/teamcontroller');
const { protect, restrictTo } = require('../middlewares/auth');

const router = express.Router({ mergeParams: true });

// Route to get all teams for a specific event (e.g., /api/events/:eventId/teams)
router.route('/')
  .get(getEventTeams);

// Route to create a new team
router.post('/', protect, restrictTo('participant'), createTeam);

// Note: You will need to add more routes here for updating, deleting, joining teams etc.

module.exports = router;
