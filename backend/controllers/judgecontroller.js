const Evaluation = require('../models/Evaluation');
const Project = require('../models/Project');

/**
 * @desc      Evaluate a project
 * @route     POST /api/judge/projects/:projectId/evaluate
 * @access    Private (Judge)
 */
exports.evaluateProject = async (req, res, next) => {
  try {
    const { projectId } = req.params;
    const { scores, feedback, strengths, improvements } = req.body;

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ status: 'fail', message: 'Project not found' });
    }

    // Check if judge has already evaluated this project in this round
    let evaluation = await Evaluation.findOne({
      projectId,
      judgeId: req.user.id,
      round: project.round // Assuming evaluation is for the project's current round
    });

    if (evaluation) {
      // Update existing evaluation
      evaluation.scores = scores;
      evaluation.feedback = feedback;
      evaluation.strengths = strengths;
      evaluation.improvements = improvements;
      await evaluation.save();
    } else {
      // Create new evaluation
      evaluation = await Evaluation.create({
        projectId,
        judgeId: req.user.id,
        eventId: project.eventId,
        round: project.round,
        scores,
        feedback,
        strengths,
        improvements
      });
    }

    // Optionally, update project status
    project.status = 'evaluated';
    await project.save();

    res.status(200).json({
      status: 'success',
      data: { evaluation }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc      Get projects assigned to a judge for an event
 * @route     GET /api/judge/events/:eventId/projects
 * @access    Private (Judge)
 */
exports.getAssignedProjects = async (req, res, next) => {
    try {
        // This is a simplified logic. A real app might have a specific assignment model.
        // For now, we assume judges can see all submitted projects for events they are assigned to.
        const projects = await Project.find({
            eventId: req.params.eventId,
            status: { $in: ['submitted', 'under_review', 'evaluated'] }
        }).populate('teamId', 'name');

        res.status(200).json({
            status: 'success',
            results: projects.length,
            data: { projects }
        });
    } catch (error) {
        next(error);
    }
};
