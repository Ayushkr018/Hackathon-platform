const mongoose = require('mongoose');

const evaluationSchema = new mongoose.Schema({
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  judgeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true
  },
  round: {
    type: String,
    required: true,
    default: 'final'
  },
  scores: {
    innovation: {
      type: Number,
      required: true,
      min: 0,
      max: 10
    },
    technical: {
      type: Number,
      required: true,
      min: 0,
      max: 10
    },
    design: {
      type: Number,
      required: true,
      min: 0,
      max: 10
    },
    feasibility: {
      type: Number,
      required: true,
      min: 0,
      max: 10
    },
    presentation: {
      type: Number,
      required: true,
      min: 0,
      max: 10
    }
  },
  totalScore: {
    type: Number,
    default: 0
  },
  feedback: {
    type: String,
    maxlength: [1000, 'Feedback cannot be more than 1000 characters']
  },
  strengths: [String],
  improvements: [String],
  submittedAt: {
    type: Date,
    default: Date.now
  },
  isSubmitted: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Calculate total score before saving
evaluationSchema.pre('save', function(next) {
  this.totalScore = Object.values(this.scores).reduce((sum, score) => sum + score, 0);
  next();
});

// Compound index for judge-project uniqueness per round
evaluationSchema.index({ judgeId: 1, projectId: 1, round: 1 }, { unique: true });

module.exports = mongoose.model('Evaluation', evaluationSchema);
