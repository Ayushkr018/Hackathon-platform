const express = require('express');
const {
  evaluateProject,
  getAssignedProjects
} = require('../controllers/judgecontroller');
const { protect, restrictTo } = require('../middlewares/auth');

const router = express.Router();

// All routes below are protected and restricted to judges
router.use(protect, restrictTo('judge'));

// Route to evaluate a specific project
router.post('/projects/:projectId/evaluate', evaluateProject);

// Route to get all projects for a specific event that a judge can see
router.get('/events/:eventId/projects', getAssignedProjects);

module.exports = router;
