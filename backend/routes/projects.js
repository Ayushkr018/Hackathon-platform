const express = require('express');
const {
  submitProject,
  getEventProjects
} = require('../controllers/projectcontroller');
const { protect, restrictTo } = require('../middlewares/auth');

const router = express.Router({ mergeParams: true });

// Route to get all projects for a specific event (e.g., /api/events/:eventId/projects)
router.route('/')
  .get(getEventProjects);

// Route to submit or update a project
router.post('/', protect, restrictTo('participant'), submitProject);

// Note: You will need to add more routes for getting a single project, etc.

module.exports = router;

