exports.USER_ROLES = {
  PARTICIPANT: 'participant',
  ORGANIZER: 'organizer',
  JUDGE: 'judge',
  ADMIN: 'admin'
};

exports.EVENT_STATUS = {
  DRAFT: 'draft',
  PUBLISHED: 'published',
  ONGOING: 'ongoing',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled'
};

exports.PROJECT_STATUS = {
  DRAFT: 'draft',
  SUBMITTED: 'submitted',
  UNDER_REVIEW: 'under_review',
  EVALUATED: 'evaluated'
};

exports.TEAM_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  DISBANDED: 'disbanded'
};

exports.ANNOUNCEMENT_PRIORITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  URGENT: 'urgent'
};

exports.SCORING_CRITERIA = {
  INNOVATION: 'innovation',
  TECHNICAL: 'technical',
  DESIGN: 'design',
  FEASIBILITY: 'feasibility',
  PRESENTATION: 'presentation'
};

exports.MAX_TEAM_SIZE = 10;
exports.MIN_TEAM_SIZE = 1;
exports.MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
