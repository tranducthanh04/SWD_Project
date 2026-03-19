const { body } = require('express-validator');
const { ROLE_VALUES } = require('../constants/roles');
const { PASSWORD_REGEX } = require('../utils/password');

const strongPasswordMessage =
  'Password must be at least 8 characters and include uppercase, lowercase, number, and special character';

const registerValidator = [
  body('username').trim().isLength({ min: 3, max: 30 }),
  body('email').isEmail().normalizeEmail(),
  body('fullName').trim().notEmpty(),
  body('gender').optional().isIn(['male', 'female', 'other']),
  body('role').isIn(ROLE_VALUES.filter((role) => role !== 'admin')),
  body('password').matches(PASSWORD_REGEX).withMessage(strongPasswordMessage),
];

const verifyEmailValidator = [body('email').isEmail().normalizeEmail(), body('code').isLength({ min: 6, max: 6 })];

const loginValidator = [body('identifier').trim().notEmpty(), body('password').notEmpty()];

const googleLoginValidator = [body('email').isEmail().normalizeEmail(), body('fullName').trim().notEmpty()];

const forgotPasswordValidator = [body('username').trim().notEmpty(), body('email').isEmail().normalizeEmail()];

const resetPasswordValidator = [
  body('username').trim().notEmpty(),
  body('email').isEmail().normalizeEmail(),
  body('code').isLength({ min: 6, max: 6 }),
  body('newPassword').matches(PASSWORD_REGEX).withMessage(strongPasswordMessage),
  body('confirmNewPassword').custom((value, { req }) => {
    if (value !== req.body.newPassword) {
      throw new Error('Confirm password does not match new password');
    }
    return true;
  }),
];

const changePasswordValidator = [
  body('currentPassword').notEmpty(),
  body('newPassword').matches(PASSWORD_REGEX).withMessage(strongPasswordMessage),
  body('confirmNewPassword').custom((value, { req }) => {
    if (value !== req.body.newPassword) {
      throw new Error('Confirm password does not match new password');
    }
    return true;
  }),
];

const refreshTokenValidator = [body('refreshToken').notEmpty()];

module.exports = {
  registerValidator,
  verifyEmailValidator,
  loginValidator,
  googleLoginValidator,
  forgotPasswordValidator,
  resetPasswordValidator,
  changePasswordValidator,
  refreshTokenValidator,
};
