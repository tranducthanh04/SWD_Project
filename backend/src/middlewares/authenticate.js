const User = require('../models/User');
const AppError = require('../utils/AppError');
const { verifyAccessToken } = require('../utils/jwt');

module.exports = async (req, _res, next) => {
  try {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

    if (!token) {
      return next(new AppError('Vui lòng đăng nhập để tiếp tục', 401));
    }

    const payload = verifyAccessToken(token);
    const user = await User.findById(payload.sub);

    if (!user || !user.isActive || user.isBanned) {
      return next(new AppError('Người dùng không được phép truy cập tài nguyên này', 401));
    }

    req.user = user;
    return next();
  } catch (_error) {
    return next(new AppError('Access token không hợp lệ hoặc đã hết hạn', 401));
  }
};
