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
} = require('../controllers/eventcontroller');

const router = express.Router();

// Create event - Requires user to be an organizer or admin
router.post('/', protect, restrictTo('organizer', 'admin'), validate(createEventSchema), createEvent);

// Get all events - Public, no authentication needed
router.get('/', getEvents);

// Get single event - Public, no authentication needed
router.get('/:id', getEvent);

// Update event - Requires user to be an organizer or admin
router.put('/:id', protect, restrictTo('organizer', 'admin'), validate(updateEventSchema), updateEvent);

// Delete event - Requires user to be an organizer or admin
router.delete('/:id', protect, restrictTo('organizer', 'admin'), deleteEvent);

// Register for event - Requires user to be a participant
router.post('/:id/register', protect, restrictTo('participant'), registerForEvent);

// Get event participants - Requires user to be an organizer, judge, or admin
router.get('/:id/participants', protect, restrictTo('organizer', 'judge', 'admin'), getEventParticipants);

module.exports = router;
