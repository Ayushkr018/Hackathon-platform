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
  // getEventTeams // This function does not exist in your controller, so we remove it for now
} = require('../controllers/eventcontroller'); // Corrected filename case

const router = express.Router();

/**
 * @swagger
 * /api/events:
 * post:
 * tags:
 * - Events
 * summary: Create a new event
 * security:
 * - bearerAuth: []
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * name:
 * type: string
 * description:
 * type: string
 * startDate:
 * type: string
 * format: date-time
 * endDate:
 * type: string
 * format: date-time
 * registrationDeadline:
 * type: string
 * format: date-time
 * maxTeamSize:
 * type: integer
 * required:
 * - name
 * - description
 * - startDate
 * - endDate
 * - registrationDeadline
 * - maxTeamSize
 * responses:
 * '201':
 * description: Event created successfully
 */
router.post('/', protect, restrictTo('organizer', 'admin'), validate(createEventSchema), createEvent);

/**
 * @swagger
 * /api/events:
 * get:
 * tags:
 * - Events
 * summary: Get all events with optional filters
 * parameters:
 * - name: search
 * in: query
 * description: Search events by name, description, or themes
 * schema:
 * type: string
 * - name: status
 * in: query
 * description: Filter by event status
 * schema:
 * type: string
 * enum: [draft, published, ongoing, completed, cancelled]
 * - name: page
 * in: query
 * description: Page number for pagination
 * schema:
 * type: integer
 * minimum: 1
 * - name: limit
 * in: query
 * description: Number of events per page
 * schema:
 * type: integer
 * minimum: 1
 * maximum: 50
 * responses:
 * '200':
 * description: List of events
 */
router.get('/', getEvents);

router.get('/:id', getEvent);
router.put('/:id', protect, restrictTo('organizer', 'admin'), validate(updateEventSchema), updateEvent);
router.delete('/:id', protect, restrictTo('organizer', 'admin'), deleteEvent);

router.post('/:id/register', protect, restrictTo('participant'), registerForEvent);
router.get('/:id/participants', protect, restrictTo('organizer', 'judge', 'admin'), getEventParticipants);

// router.get('/:id/teams', protect, getEventTeams); // This line is removed because the controller function is missing

module.exports = router;
