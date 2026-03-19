const multer = require('multer');

module.exports = (error, _req, res, _next) => {
  if (error instanceof multer.MulterError) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }

  const statusCode = error.statusCode || 500;
  return res.status(statusCode).json({
    success: false,
    message: error.message || 'Internal server error',
    errors: error.errors || null,
    ...(process.env.NODE_ENV !== 'production' && error.stack ? { stack: error.stack } : {}),
  });
};
