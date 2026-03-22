const { body } = require('express-validator');

const createReportValidator = [
  body('jobId').isMongoId(),
  body('title').trim().notEmpty().isLength({ max: 120 }),
  body('content').trim().notEmpty().isLength({ max: 2000 }),
];

module.exports = {
  createReportValidator,
};
