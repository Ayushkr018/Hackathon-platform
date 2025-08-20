const Joi = require('joi');

// Auth validators
exports.registerSchema = Joi.object({
  name: Joi.string().min(2).max(50).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().valid('participant', 'organizer', 'judge').default('participant')
});

exports.loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

// Event validators
exports.createEventSchema = Joi.object({
  name: Joi.string().min(3).max(100).required(),
  description: Joi.string().min(10).max(2000).required(),
  startDate: Joi.date().greater('now').required(),
  endDate: Joi.date().greater(Joi.ref('startDate')).required(),
  registrationDeadline: Joi.date().less(Joi.ref('startDate')).required(),
  maxTeamSize: Joi.number().integer().min(1).max(10).required(),
  minTeamSize: Joi.number().integer().min(1).default(1),
  themes: Joi.array().items(Joi.string()),
  technologies: Joi.array().items(Joi.string()),
  prizes: Joi.array().items(Joi.object({
    position: Joi.string().required(),
    amount: Joi.number().min(0),
    description: Joi.string()
  })),
  rules: Joi.string().max(5000),
  maxParticipants: Joi.number().integer().min(1)
});

exports.updateEventSchema = Joi.object({
  name: Joi.string().min(3).max(100),
  description: Joi.string().min(10).max(2000),
  startDate: Joi.date().greater('now'),
  endDate: Joi.date().greater(Joi.ref('startDate')),
  registrationDeadline: Joi.date().less(Joi.ref('startDate')),
  maxTeamSize: Joi.number().integer().min(1).max(10),
  minTeamSize: Joi.number().integer().min(1),
  themes: Joi.array().items(Joi.string()),
  technologies: Joi.array().items(Joi.string()),
  prizes: Joi.array().items(Joi.object({
    position: Joi.string().required(),
    amount: Joi.number().min(0),
    description: Joi.string()
  })),
  rules: Joi.string().max(5000),
  status: Joi.string().valid('draft', 'published', 'ongoing', 'completed', 'cancelled'),
  maxParticipants: Joi.number().integer().min(1)
});

// Team validators
exports.createTeamSchema = Joi.object({
  name: Joi.string().min(2).max(50).required(),
  eventId: Joi.string().required(),
  description: Joi.string().max(500),
  lookingForMembers: Joi.boolean().default(false),
  requiredSkills: Joi.array().items(Joi.string())
});

exports.updateTeamSchema = Joi.object({
  name: Joi.string().min(2).max(50),
  description: Joi.string().max(500),
  lookingForMembers: Joi.boolean(),
  requiredSkills: Joi.array().items(Joi.string())
});

// Project validators
exports.createProjectSchema = Joi.object({
  teamId: Joi.string().required(),
  eventId: Joi.string().required(),
  round: Joi.string().default('final'),
  title: Joi.string().min(3).max(100).required(),
  description: Joi.string().min(10).max(2000).required(),
  githubUrl: Joi.string().uri().regex(/^https:\/\/github\.com\/.*/),
  liveUrl: Joi.string().uri(),
  videoUrl: Joi.string().uri().regex(/^https:\/\/(www\.)?(youtube\.com|youtu\.be|vimeo\.com)\/.*/),
  technologies: Joi.array().items(Joi.string()),
  themes: Joi.array().items(Joi.string())
});

exports.updateProjectSchema = Joi.object({
  title: Joi.string().min(3).max(100),
  description: Joi.string().min(10).max(2000),
  githubUrl: Joi.string().uri().regex(/^https:\/\/github\.com\/.*/),
  liveUrl: Joi.string().uri(),
  videoUrl: Joi.string().uri().regex(/^https:\/\/(www\.)?(youtube\.com|youtu\.be|vimeo\.com)\/.*/),
  technologies: Joi.array().items(Joi.string()),
  themes: Joi.array().items(Joi.string()),
  status: Joi.string().valid('draft', 'submitted')
});

// Evaluation validators
exports.evaluateProjectSchema = Joi.object({
  scores: Joi.object({
    innovation: Joi.number().min(0).max(10).required(),
    technical: Joi.number().min(0).max(10).required(),
    design: Joi.number().min(0).max(10).required(),
    feasibility: Joi.number().min(0).max(10).required(),
    presentation: Joi.number().min(0).max(10).required()
  }).required(),
  feedback: Joi.string().max(1000),
  strengths: Joi.array().items(Joi.string()),
  improvements: Joi.array().items(Joi.string())
});

// Announcement validators
exports.createAnnouncementSchema = Joi.object({
  eventId: Joi.string().required(),
  title: Joi.string().min(3).max(100).required(),
  content: Joi.string().min(10).max(2000).required(),
  targetAudience: Joi.string().valid('all', 'participants', 'judges', 'teams').default('all'),
  priority: Joi.string().valid('low', 'medium', 'high', 'urgent').default('medium'),
  publishAt: Joi.date().default(Date.now)
});

exports.updateAnnouncementSchema = Joi.object({
  title: Joi.string().min(3).max(100),
  content: Joi.string().min(10).max(2000),
  targetAudience: Joi.string().valid('all', 'participants', 'judges', 'teams'),
  priority: Joi.string().valid('low', 'medium', 'high', 'urgent'),
  isPublished: Joi.boolean()
});

// User validators
exports.updateProfileSchema = Joi.object({
  name: Joi.string().min(2).max(50),
  bio: Joi.string().max(500),
  skills: Joi.array().items(Joi.string())
});
