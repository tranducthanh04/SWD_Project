const mongoose = require('mongoose');
const { REPORT_STATUSES } = require('../constants/report');

const ReportSchema = new mongoose.Schema(
  {
    reporterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job',
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: REPORT_STATUSES,
      default: 'pending',
    },
  },
  { timestamps: true },
);

ReportSchema.index({ reporterId: 1, jobId: 1 }, { unique: true });

module.exports = mongoose.model('Report', ReportSchema);
