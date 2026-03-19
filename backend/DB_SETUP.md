# 🗄️ Database Connection Framework

## Cấu trúc thư mục

```
backend/
├── config/
│   └── database.js          # Cấu hình kết nối MongoDB
├── models/
│   └── User.js              # Model ví dụ
├── middleware/
│   └── errorHandler.js      # Xử lý lỗi
├── server.js                # Server chính
└── .env                     # Biến môi trường
```

## 🚀 Cách sử dụng

### 1. Cài đặt dependencies
```bash
npm install
```

### 2. Cấu hình .env
Đảm bảo file `.env` có:
```
MONGO_URI=mongodb://localhost:27017/searching_job
JWT_SECRET=yourkeycanchange
PORT=5000
```

### 3. Chạy server
**Development (với auto-reload):**
```bash
npm run dev
```

**Production:**
```bash
npm start
```

## 📚 Tạo Model mới

Mẫu model ở `models/User.js`. Tạo file tương tự:

```javascript
// models/YourModel.js
const mongoose = require('mongoose');

const yourSchema = new mongoose.Schema({
  field1: { type: String, required: true },
  field2: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('YourModel', yourSchema);
```

## 🔌 Tính năng

✅ Kết nối MongoDB an toàn với retry  
✅ Middleware xử lý lỗi (validation, duplicate, JWT, etc.)  
✅ Graceful shutdown (ngắt kết nối khi tắt server)  
✅ Timestamps tự động (createdAt, updatedAt)  
✅ CORS hỗ trợ frontend

## 📝 Ví dụ Route cơ bản

```javascript
const User = require('../models/User');

// GET all users
app.get('/api/users', async (req, res, next) => {
  try {
    const users = await User.find();
    res.json({ success: true, data: users });
  } catch (error) {
    next(error);
  }
});

// POST create user
app.post('/api/users', async (req, res, next) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
});
```

## ⚠️ Lưu ý

- Luôn gọi `next(error)` để middleware errorHandler xử lý
- Mật khẩu cần được hash trước khi lưu (tham khảo bcrypt)
- Thay đổi JWT_SECRET trong .env trước khi deploy
