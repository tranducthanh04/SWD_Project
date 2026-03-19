const { body } = require('express-validator');
const { APPLICATION_STATUSES } = require('../constants/application');

const createApplicationValidator = [body('coverLetter').optional().isLength({ max: 3000 })];

const updateApplicationStatusValidator = [
  body('status').isIn(APPLICATION_STATUSES),
  body('note').optional().isLength({ max: 1000 }),
];

module.exports = {
  createApplicationValidator,
  updateApplicationStatusValidator,
};
