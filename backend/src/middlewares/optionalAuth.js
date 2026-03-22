const User = require('../models/User');
const { verifyAccessToken } = require('../utils/jwt');

module.exports = async (req, _res, next) => {
  try {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

    if (!token) {
      return next();
    }

    const payload = verifyAccessToken(token);
    const user = await User.findById(payload.sub);
    if (user && user.isActive && !user.isBanned) {
      req.user = user;
    }
  } catch (_error) {
    // Ignore optional auth failures.
  }

  return next();
};
