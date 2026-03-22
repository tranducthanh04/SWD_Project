const { validationResult } = require('express-validator');
const AppError = require('../utils/AppError');

module.exports = (req, _res, next) => {
  const errors = validationResult(req);

  if (errors.isEmpty()) {
    return next();
  }

  return next(new AppError('Dữ liệu đầu vào không hợp lệ', 422, errors.array()));
};
