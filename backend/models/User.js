const mongoose = require('mongoose');

// Schema ví dụ User - Thay đổi theo nhu cầu của bạn
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Vui lòng nhập tên'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Vui lòng nhập email'],
      unique: true,
      lowercase: true,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Email không hợp lệ'],
    },
    password: {
      type: String,
      required: [true, 'Vui lòng nhập mật khẩu'],
      minlength: 6,
      select: false, // Không trả về password mặc định
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true } // Tự thêm createdAt, updatedAt
);

// Hash password trước khi lưu (tùy chọn, thường dùng trong route)
// userSchema.pre('save', async function(next) {
//   if (!this.isModified('password')) return next();
//   this.password = await require('bcrypt').hash(this.password, 10);
//   next();
// });

const User = mongoose.model('User', userSchema);

module.exports = User;
