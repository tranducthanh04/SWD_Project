const { body } = require('express-validator');
const { EXPERIENCE_LEVELS, JOB_TYPES } = require('../constants/job');

const arrayLike = (value) => Array.isArray(value) || typeof value === 'string';

const jobPayloadValidator = [
  body('title').trim().notEmpty(),
  body('overview').trim().notEmpty(),
  body('description').trim().notEmpty(),
  body('location').trim().notEmpty(),
  body('salaryMin').isFloat({ min: 0 }),
  body('salaryMax').isFloat({ min: 0 }),
  body('experienceLevel').isIn(EXPERIENCE_LEVELS),
  body('jobType').isIn(JOB_TYPES),
  body('applicationDeadline').isISO8601(),
  body('requirements').custom(arrayLike).withMessage('Requirements must be an array or comma-separated string'),
  body('tags').custom(arrayLike).withMessage('Tags must be an array or comma-separated string'),
];

const adminReviewValidator = [body('note').optional().trim().isLength({ max: 500 })];

module.exports = {
  jobPayloadValidator,
  adminReviewValidator,
};
