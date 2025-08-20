const express = require('express');
const { protect, restrictTo } = require('../middlewares/auth');
const { validate } = require('../middlewares/validation');
const { createEventSchema, updateEventSchema } = require('../validators');
const {
  createEvent,
  getEvents,
  getEvent,
  updateEvent,
  deleteEvent,
  registerForEvent,
  getEventParticipants,
  getEventTeams
} = require('../controllers/eventController');

const router = express.Router();

/**
 * @swagger
 * /api/events:
 *   post:
 *     tags: [Events]
 *     summary: Create a new event
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - description
 *               - startDate
 *               - endDate
 *               - registrationDeadline
 *               - maxTeamSize
 *     responses:
 *       201:
 *         description: Event created successfully
 */
router.post('/', protect, restrictTo('organizer', 'admin'), validate(createEventSchema), createEvent);

/**
 * @swagger
 * /api/events:
 *   get:
 *     tags: [Events]
 *     summary: Get all events with optional filters
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search events by name, description, or themes
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [draft, published, ongoing, completed, cancelled]
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 50
 *         description: Number of events per page
 *     responses:
 *       200:
 *         description: List of events
 */
router.get('/', getEvents);

router.get('/:id', getEvent);
router.put('/:id', protect, restrictTo('organizer', 'admin'), validate(updateEventSchema), updateEvent);
router.delete('/:id', protect, restrictTo('organizer', 'admin'), deleteEvent);

router.post('/:id/register', protect, restrictTo('participant'), registerForEvent);
router.get('/:id/participants', protect, restrictTo('organizer', 'judge', 'admin'), getEventParticipants);
router.get('/:id/teams', protect, getEventTeams);

module.exports = router;
