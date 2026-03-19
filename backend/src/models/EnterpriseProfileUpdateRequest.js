const mongoose = require('mongoose');

const EnterpriseProfileUpdateRequestSchema = new mongoose.Schema(
  {
    enterpriseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    oldData: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    newData: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    reviewedAt: Date,
    note: String,
  },
  { timestamps: true },
);

module.exports = mongoose.model('EnterpriseProfileUpdateRequest', EnterpriseProfileUpdateRequestSchema);
