const { body } = require('express-validator');

const tagValidator = [
  body('name').trim().notEmpty(),
  body('description').optional().trim(),
  body('isActive').optional().isBoolean(),
];

module.exports = {
  tagValidator,
};
