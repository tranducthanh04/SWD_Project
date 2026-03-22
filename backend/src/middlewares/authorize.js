const AppError = require('../utils/AppError');

module.exports = (...roles) => (req, _res, next) => {
  if (!req.user) {
    return next(new AppError('Vui lòng đăng nhập để tiếp tục', 401));
  }

  if (!roles.includes(req.user.role)) {
    return next(new AppError('Bạn không có quyền truy cập tài nguyên này', 403));
  }

  return next();
};
