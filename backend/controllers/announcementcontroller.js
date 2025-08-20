const Announcement = require('../models/Announcement');
const Event = require('../models/Event');

/**
 * @desc      Create an announcement for an event
 * @route     POST /api/announcements
 * @access    Private (Organizer)
 */
exports.createAnnouncement = async (req, res, next) => {
  try {
    const { eventId, title, content, targetAudience, priority } = req.body;

    // Check if user is the organizer of the event
    const event = await Event.findById(eventId);
    if (!event || event.organizerId.toString() !== req.user.id) {
      return res.status(403).json({ status: 'fail', message: 'You are not authorized to create announcements for this event.' });
    }

    const announcement = await Announcement.create({
      eventId,
      title,
      content,
      targetAudience,
      priority,
      createdBy: req.user.id
    });

    res.status(201).json({
      status: 'success',
      data: { announcement }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc      Get all announcements for an event
 * @route     GET /api/events/:eventId/announcements
 * @access    Public
 */
exports.getEventAnnouncements = async (req, res, next) => {
  try {
    const announcements = await Announcement.find({ eventId: req.params.eventId })
      .populate('createdBy', 'name avatar')
      .sort('-createdAt');

    res.status(200).json({
      status: 'success',
      results: announcements.length,
      data: { announcements }
    });
  } catch (error) {
    next(error);
  }
};
