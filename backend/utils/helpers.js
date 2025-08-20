/**
 * Generate random string
 */
exports.generateRandomString = (length = 10) => {
  return Math.random().toString(36).substring(2, length + 2);
};

/**
 * Calculate average score
 */
exports.calculateAverage = (scores) => {
  if (!scores || scores.length === 0) return 0;
  const sum = scores.reduce((acc, score) => acc + score, 0);
  return sum / scores.length;
};

/**
 * Format file size
 */
exports.formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Check if user is team member
 */
exports.isTeamMember = (team, userId) => {
  return team.members.some(member => member.user.toString() === userId.toString());
};

/**
 * Check if user is team leader
 */
exports.isTeamLeader = (team, userId) => {
  return team.leaderId.toString() === userId.toString();
};

/**
 * Sanitize filename
 */
exports.sanitizeFilename = (filename) => {
  return filename.replace(/[^a-z0-9.-]/gi, '_');
};

/**
 * Generate pagination info
 */
exports.getPaginationInfo = (page, limit, total) => {
  return {
    page: parseInt(page),
    limit: parseInt(limit),
    total,
    pages: Math.ceil(total / limit),
    hasNext: page < Math.ceil(total / limit),
    hasPrev: page > 1
  };
};
