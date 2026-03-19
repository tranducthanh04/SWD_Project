require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { connectDB, disconnectDB } = require('./config/database');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 5000;

// ==================== MIDDLEWARE ====================
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ==================== ROUTES ====================
// Health check
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Server đang chạy' });
});

// Example route - xóa hoặc thay đổi theo nhu cầu
app.get('/api/test', (req, res) => {
  res.json({ success: true, message: 'API test endpoint' });
});

// ==================== ERROR HANDLER ====================
app.use(errorHandler);

// ==================== 404 HANDLER ====================
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route không tồn tại',
  });
});

// ==================== DATABASE & SERVER ====================
const startServer = async () => {
  try {
    // Kết nối Database
    await connectDB();

    // Khởi động server
    app.listen(PORT, () => {
      console.log(`✓ Server chạy trên http://localhost:${PORT}`);
    });

    // Xử lý tín hiệu đóng
    process.on('SIGTERM', async () => {
      console.log('SIGTERM nhận được, đóng server...');
      await disconnectDB();
      process.exit(0);
    });

    process.on('SIGINT', async () => {
      console.log('SIGINT nhận được, đóng server...');
      await disconnectDB();
      process.exit(0);
    });
  } catch (error) {
    console.error('❌ Lỗi khởi động server:', error);
    process.exit(1);
  }
};

startServer();

module.exports = app;
