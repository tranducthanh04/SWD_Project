const { body } = require('express-validator');

const updateJobSeekerProfileValidator = [
  body('fullName').optional().trim().notEmpty(),
  body('phone').optional().trim(),
  body('address').optional().trim(),
  body('dateOfBirth').optional().isISO8601(),
  body('experienceYears').optional().isFloat({ min: 0 }),
  body('education').optional().trim(),
  body('summary').optional().trim(),
];

const enterpriseUpdateRequestValidator = [
  body('companyName').optional().trim().notEmpty(),
  body('companyEmail').optional().isEmail(),
  body('companyPhone').optional().trim(),
  body('companyAddress').optional().trim(),
  body('taxCode').optional().trim(),
  body('website').optional().isURL().withMessage('Website must be a valid URL'),
  body('description').optional().trim(),
];

module.exports = {
  updateJobSeekerProfileValidator,
  enterpriseUpdateRequestValidator,
};
