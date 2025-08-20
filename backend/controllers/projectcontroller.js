const Project = require('../models/Project');
const Team = require('../models/Team');

/**
 * @desc      Submit a project for a team in an event
 * @route     POST /api/projects
 * @access    Private (Team Leader)
 */
exports.submitProject = async (req, res, next) => {
  try {
    const { teamId, eventId, title, description, githubUrl, liveUrl, videoUrl } = req.body;

    // Check if the user is the leader of the team
    const team = await Team.findById(teamId);
    if (!team || team.leaderId.toString() !== req.user.id) {
      return res.status(403).json({ status: 'fail', message: 'Only the team leader can submit a project.' });
    }

    // Check if a project already exists for this team and event
    let project = await Project.findOne({ teamId, eventId });

    if (project) {
      // Update existing project
      project.title = title;
      project.description = description;
      project.githubUrl = githubUrl;
      project.liveUrl = liveUrl;
      project.videoUrl = videoUrl;
      project.status = 'submitted';
      await project.save();
    } else {
      // Create new project
      project = await Project.create({
        ...req.body,
        status: 'submitted'
      });
    }

    res.status(201).json({
      status: 'success',
      data: { project }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc      Get all projects for an event
 * @route     GET /api/events/:eventId/projects
 * @access    Public
 */
exports.getEventProjects = async (req, res, next) => {
  try {
    const projects = await Project.find({ eventId: req.params.eventId })
      .populate({
        path: 'teamId',
        select: 'name members',
        populate: {
          path: 'members.user',
          select: 'name avatar'
        }
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
