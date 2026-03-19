const mongoose = require('mongoose');

const EnterpriseProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      unique: true,
      required: true,
    },
    companyName: String,
    companyEmail: String,
    companyPhone: String,
    companyAddress: String,
    taxCode: String,
    website: String,
    description: String,
    logo: String,
    verificationStatus: {
      type: String,
      enum: ['pending', 'verified', 'rejected'],
      default: 'pending',
    },
    accountPlan: {
      type: String,
      enum: ['free', 'premium'],
      default: 'free',
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model('EnterpriseProfile', EnterpriseProfileSchema);
