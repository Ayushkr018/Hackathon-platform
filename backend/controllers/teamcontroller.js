const Team = require('../models/Team');
const Event = require('../models/Event');
const User = require('../models/User');

/**
 * @desc      Create a team for an event
 * @route     POST /api/teams
 * @access    Private (Participant)
 */
exports.createTeam = async (req, res, next) => {
  try {
    const { name, eventId, description, lookingForMembers, requiredSkills } = req.body;

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ status: 'fail', message: 'Event not found' });
    }

    // Check if user is already in a team for this event
    const existingTeam = await Team.findOne({ eventId, 'members.user': req.user.id });
    if (existingTeam) {
      return res.status(400).json({ status: 'fail', message: 'You are already in a team for this event' });
    }

    const team = await Team.create({
      name,
      eventId,
      description,
      lookingForMembers,
      requiredSkills,
      leaderId: req.user.id,
      members: [{ user: req.user.id, role: 'leader' }]
    });

    res.status(201).json({
      status: 'success',
      data: { team }
    });
  } catch (error) {
    next(error);
  }
};


/**
 * @desc      Get all teams for a specific event
 * @route     GET /api/events/:eventId/teams
 * @access    Public
 */
exports.getEventTeams = async (req, res, next) => {
  try {
    const teams = await Team.find({ eventId: req.params.eventId }).populate('members.user', 'name avatar');

    res.status(200).json({
      status: 'success',
      results: teams.length,
      data: { teams }
    });
  } catch (error) {
    next(error);
  }
};