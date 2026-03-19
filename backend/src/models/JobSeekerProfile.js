const mongoose = require('mongoose');
const { calculateJobSeekerProfileCompleted } = require('../utils/profile');

const JobSeekerProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      unique: true,
      required: true,
    },
    dateOfBirth: Date,
    experienceYears: {
      type: Number,
      default: 0,
    },
    skills: {
      type: [String],
      default: [],
    },
    education: String,
    summary: String,
    cvFileUrl: String,
    profileCompleted: {
      type: Boolean,
      default: false,
    },
    favouriteTags: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true },
);

JobSeekerProfileSchema.pre('save', function syncProfileCompleted(next) {
  this.profileCompleted = calculateJobSeekerProfileCompleted(this);
  next();
});

module.exports = mongoose.model('JobSeekerProfile', JobSeekerProfileSchema);
