const mongoose = require('mongoose');
const { APPLICATION_STATUSES } = require('../constants/application');

const ApplicationHistorySchema = new mongoose.Schema(
  {
    status: {
      type: String,
      enum: APPLICATION_STATUSES,
      required: true,
    },
    changedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    changedAt: {
      type: Date,
      default: Date.now,
    },
    note: String,
  },
  { _id: false },
);

const ApplicationSchema = new mongoose.Schema(
  {
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job',
      required: true,
    },
    enterpriseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    jobSeekerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    cvFileUrl: {
      type: String,
      required: true,
    },
    coverLetter: String,
    status: {
      type: String,
      enum: APPLICATION_STATUSES,
      default: 'Processing CV Round',
    },
    appliedAt: {
      type: Date,
      default: Date.now,
    },
    withdrawnAt: Date,
    history: {
      type: [ApplicationHistorySchema],
      default: [],
    },
    isWithdrawn: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

ApplicationSchema.index({ jobId: 1, jobSeekerId: 1 }, { unique: true });

module.exports = mongoose.model('Application', ApplicationSchema);
