module.exports = (req, res) => {
  res.status(404).json({
    success: false,
    message: `Không tìm thấy đường dẫn ${req.originalUrl}`,
  });
};
