const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { ROLE_VALUES } = require('../constants/roles');

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    passwordHash: {
      type: String,
      required: true,
      select: false,
    },
    gender: {
      type: String,
      enum: ['male', 'female', 'other'],
      default: 'other',
    },
    role: {
      type: String,
      enum: ROLE_VALUES,
      required: true,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isBanned: {
      type: Boolean,
      default: false,
    },
    authProvider: {
      type: String,
      enum: ['local', 'google'],
      default: 'local',
    },
    avatar: String,
    phone: String,
    address: String,
    lastLoginAt: Date,
    deletedAt: Date,
    security: {
      mfaEnabled: {
        type: Boolean,
        default: false,
      },
      mfaChannel: {
        type: String,
        default: 'email',
      },
    },
  },
  { timestamps: true },
);

UserSchema.methods.comparePassword = function comparePassword(plainTextPassword) {
  return bcrypt.compare(plainTextPassword, this.passwordHash);
};

module.exports = mongoose.model('User', UserSchema);
