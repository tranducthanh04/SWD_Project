const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Cấu hình Mongoose
    const mongoUri = process.env.MONGO_URI;
    
    if (!mongoUri) {
      throw new Error('MONGO_URI không được định nghĩa trong .env');
    }

    console.log('Đang kết nối MongoDB...');
    
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, // Timeout sau 5s
      socketTimeoutMS: 45000,
    });

    console.log('✓ Kết nối MongoDB thành công');
    
    // Sự kiện kết nối
    mongoose.connection.on('connected', () => {
      console.log('Mongoose connected to DB');
    });

    mongoose.connection.on('disconnected', () => {
      console.log('⚠ Mongoose disconnected');
    });

    mongoose.connection.on('error', (err) => {
      console.error('❌ Mongoose connection error:', err);
    });

    return mongoose.connection;
  } catch (error) {
    console.error('❌ Lỗi kết nối MongoDB:', error.message);
    // Retry sau 5 giây
    setTimeout(connectDB, 5000);
  }
};

const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
    console.log('✓ Ngắt kết nối MongoDB thành công');
  } catch (error) {
    console.error('Lỗi ngắt kết nối:', error);
  }
};

module.exports = { connectDB, disconnectDB };
