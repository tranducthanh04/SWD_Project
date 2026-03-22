const mongoose = require('mongoose');
const { JOB_STATUS_VALUES, EXPERIENCE_LEVELS, JOB_TYPES } = require('../constants/job');

const JobSchema = new mongoose.Schema(
  {
    enterpriseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    overview: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    requirements: {
      type: [String],
      required: true,
      default: [],
    },
    benefits: {
      type: [String],
      default: [],
    },
    location: {
      type: String,
      required: true,
    },
    salaryMin: {
      type: Number,
      required: true,
    },
    salaryMax: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: 'USD',
    },
    experienceLevel: {
      type: String,
      enum: EXPERIENCE_LEVELS,
      required: true,
    },
    jobType: {
      type: String,
      enum: JOB_TYPES,
      required: true,
    },
    tags: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tag',
      },
    ],
    applicationDeadline: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: JOB_STATUS_VALUES,
      default: 'Processing',
    },
    adminReview: {
      reviewedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      reviewedAt: Date,
      note: String,
    },
    isExpired: {
      type: Boolean,
      default: false,
    },
    viewCount: {
      type: Number,
      default: 0,
    },
    applicantCount: {
      type: Number,
      default: 0,
    },
    deletedAt: Date,
  },
  { timestamps: true },
);

JobSchema.index({ title: 'text', overview: 'text', description: 'text', location: 'text' });

module.exports = mongoose.model('Job', JobSchema);
