const User = require('../models/User');
const AppError = require('../utils/AppError');
const { verifyAccessToken } = require('../utils/jwt');

module.exports = async (req, _res, next) => {
  try {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

    if (!token) {
      return next(new AppError('Authentication required', 401));
    }

    const payload = verifyAccessToken(token);
    const user = await User.findById(payload.sub);

    if (!user || !user.isActive || user.isBanned) {
      return next(new AppError('User is not allowed to access this resource', 401));
    }

    req.user = user;
    return next();
  } catch (_error) {
    return next(new AppError('Invalid or expired access token', 401));
  }
};
