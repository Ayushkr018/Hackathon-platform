const Event = require('../models/Event');
const Team = require('../models/Team');

/**
 * @desc    Create new event
 * @route   POST /api/events
 * @access  Private (Organizer)
 */
exports.createEvent = async (req, res, next) => {
  try {
    const eventData = {
      ...req.body,
      organizerId: req.user.id
    };

    const event = await Event.create(eventData);
    await event.populate('organizerId', 'name email avatar');

    res.status(201).json({
      status: 'success',
      data: {
        event
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all events with filters
 * @route   GET /api/events
 * @access  Public
 */
exports.getEvents = async (req, res, next) => {
  try {
    const queryObj = { ...req.query };
    const excludeFields = ['page', 'sort', 'limit', 'fields', 'search'];
    excludeFields.forEach(el => delete queryObj[el]);

    // Build query
    let query = Event.find(queryObj);

    // Search functionality
    if (req.query.search) {
      query = query.find({
        $or: [
          { name: { $regex: req.query.search, $options: 'i' } },
          { description: { $regex: req.query.search, $options: 'i' } },
          { themes: { $in: [new RegExp(req.query.search, 'i')] } }
        ]
      });
    }

    // Sorting
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort('-createdAt');
    }

    // Field limiting
    if (req.query.fields) {
      const fields = req.query.fields.split(',').join(' ');
      query = query.select(fields);
    }

    // Pagination
    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 10;
    const skip = (page - 1) * limit;

    query = query.skip(skip).limit(limit);

    // Execute query
    const events = await query.populate('organizerId', 'name email avatar').populate('judges', 'name email avatar');
    
    // Get total count for pagination
    const total = await Event.countDocuments(queryObj);

    res.status(200).json({
      status: 'success',
      results: events.length,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      },
      data: {
        events
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single event
 * @route   GET /api/events/:id
 * @access  Public
 */
exports.getEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('organizerId', 'name email avatar')
      .populate('judges', 'name email avatar');

    if (!event) {
      return res.status(404).json({
        status: 'fail',
        message: 'No event found with that ID'
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        event
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update event
 * @route   PUT /api/events/:id
 * @access  Private (Organizer - own events only)
 */
exports.updateEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        status: 'fail',
        message: 'No event found with that ID'
      });
    }

    // Check if user is the organizer
    if (event.organizerId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        status: 'fail',
        message: 'You can only update your own events'
      });
    }

    const updatedEvent = await Event.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    }).populate('organizerId', 'name email avatar').populate('judges', 'name email avatar');

    res.status(200).json({
      status: 'success',
      data: {
        event: updatedEvent
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete event
 * @route   DELETE /api/events/:id
 * @access  Private (Organizer - own events only)
 */
exports.deleteEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        status: 'fail',
        message: 'No event found with that ID'
      });
    }

    // Check if user is the organizer
    if (event.organizerId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        status: 'fail',
        message: 'You can only delete your own events'
      });
    }

    await Event.findByIdAndDelete(req.params.id);

    res.status(204).json({
      status: 'success',
      data: null
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Register for event
 * @route   POST /api/events/:id/register
 * @access  Private (Participant)
 */
exports.registerForEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        status: 'fail',
        message: 'No event found with that ID'
      });
    }

    // Check if registration is still open
    if (new Date() > event.registrationDeadline) {
      return res.status(400).json({
        status: 'fail',
        message: 'Registration deadline has passed'
      });
    }

    // Check if user already has a team for this event
    const existingTeam = await Team.findOne({
      eventId: req.params.id,
      'members.user': req.user.id
    });

    if (existingTeam) {
      return res.status(400).json({
        status: 'fail',
        message: 'You are already registered for this event'
      });
    }

    // Update registration count
    await Event.findByIdAndUpdate(req.params.id, {
      $inc: { registrationCount: 1 }
    });

    res.status(200).json({
      status: 'success',
      message: 'Successfully registered for event'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get event participants
 * @route   GET /api/events/:id/participants
 * @access  Private (Organizer/Judge)
 */
exports.getEventParticipants = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        status: 'fail',
        message: 'No event found with that ID'
      });
    }

    const teams = await Team.find({ eventId: req.params.id })
      .populate('members.user', 'name email avatar')
      .populate('leaderId', 'name email avatar');

    const participants = [];
    teams.forEach(team => {
      team.members.forEach(member => {
        participants.push({
          ...member.user.toObject(),
          teamName: team.name,
          teamId: team._id,
          isLeader: member.user._id.toString() === team.leaderId._id.toString()
        });
      });
    });

    res.status(200).json({
      status: 'success',
      results: participants.length,
      data: {
        participants
      }
    });
  } catch (error) {
    next(error);
  }
};
