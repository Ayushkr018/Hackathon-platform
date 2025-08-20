const Event = require('../models/Event');
const User = require('../models/User');
const Project = require('../models/Project');

/**
 * @desc      Get all submissions for an event
 * @route     GET /api/organizer/events/:eventId/submissions
 * @access    Private (Organizer)
 */
exports.getEventSubmissions = async (req, res, next) => {
  try {
    // First, check if the user is the organizer of this event
    const event = await Event.findById(req.params.eventId);
    if (!event || event.organizerId.toString() !== req.user.id) {
      return res.status(403).json({ status: 'fail', message: 'You are not authorized to view submissions for this event.' });
    }

    const projects = await Project.find({ eventId: req.params.eventId })
      .populate({
        path: 'teamId',
        select: 'name members',
        populate: { path: 'members.user', select: 'name avatar' }
      });

    res.status(200).json({
      status: 'success',
      results: projects.length,
      data: { projects }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc      Assign a judge to an event
 * @route     POST /api/organizer/events/:eventId/judges
 * @access    Private (Organizer)
 */
exports.assignJudge = async (req, res, next) => {
    try {
        const { judgeId } = req.body;
        const { eventId } = req.params;

        const event = await Event.findById(eventId);
        if (!event || event.organizerId.toString() !== req.user.id) {
            return res.status(403).json({ status: 'fail', message: 'You are not authorized to manage this event.' });
        }

        const judge = await User.findOne({ _id: judgeId, role: 'judge' });
        if (!judge) {
            return res.status(404).json({ status: 'fail', message: 'Judge not found.' });
        }

        // Add judge to the event if not already present
        if (!event.judges.includes(judgeId)) {
            event.judges.push(judgeId);
            await event.save();
        }

        res.status(200).json({
            status: 'success',
            message: 'Judge assigned successfully.',
            data: { event }
        });
    } catch (error) {
        next(error);
    }
};
