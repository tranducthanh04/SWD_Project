# HỆ THỐNG TÌM KIẾM VIỆC LÀM TRỰC TUYẾN

## 1. Giải thích kiến trúc tổng thể

Đây là một nền tảng tuyển dụng full-stack với frontend React/Vite tách biệt và backend Node.js/Express.

- Frontend:
  - React 19 + Vite
  - Tailwind CSS
  - React Router
  - Axios
  - Context API để quản lý trạng thái đăng nhập và phiên làm việc
  - React Hook Form + Zod để kiểm tra biểu mẫu
- Backend:
  - REST API với Express.js
  - MongoDB + Mongoose
  - JWT access token + refresh token
  - bcrypt để băm mật khẩu
  - Nodemailer cho email xác minh và đặt lại mật khẩu
  - multer để tải tệp cục bộ
  - express-validator để kiểm tra request
- Vai trò:
  - Khách truy cập
  - Ứng viên
  - Doanh nghiệp
  - Quản trị viên

### Ghi chú kiến trúc

- Tin tuyển dụng công khai chỉ hiển thị khi ở trạng thái `Published`, còn mở và chưa hết hạn.
- Tin tuyển dụng mới hoặc cập nhật đều quay về trạng thái `Processing` để quản trị viên xét duyệt.
- Yêu cầu cập nhật hồ sơ doanh nghiệp được tách riêng qua `EnterpriseProfileUpdateRequest`.
- Đơn ứng tuyển lưu toàn bộ lịch sử thay đổi trạng thái và không cho ứng tuyển lại sau khi đã rút đơn.
- Thông tin liên hệ nhạy cảm không hiển thị công khai trên trang việc làm.
- Hệ thống lưu audit log cho các thao tác quan trọng của doanh nghiệp và quản trị viên.

## 2. Cấu trúc thư mục

```text
.
├── backend
│   ├── .env.example
│   ├── app.js
│   ├── package.json
│   ├── postman
│   │   └── online-job-searching-system.collection.json
│   ├── scripts
│   │   └── seed.js
│   ├── server.js
│   └── src
│       ├── app.js
│       ├── config
│       ├── constants
│       ├── controllers
│       ├── middlewares
│       ├── models
│       ├── routes
│       ├── services
│       ├── utils
│       └── validators
├── frontend
│   ├── .env.example
│   ├── index.html
│   ├── package.json
│   ├── postcss.config.js
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── src
│       ├── api
│       ├── components
│       ├── contexts
│       ├── layouts
│       ├── pages
│       ├── routes
│       ├── App.jsx
│       ├── constants.js
│       ├── formatters.js
│       ├── index.css
│       ├── main.jsx
│       ├── schemas.js
│       └── storage.js
└── README.md
```

## 3. Backend

### Chức năng chính

- Xác thực:
  - Đăng ký
  - Xác minh email
  - Đăng nhập
  - Cấu trúc sẵn cho đăng nhập Google
  - Quên mật khẩu và đặt lại mật khẩu
  - Đổi mật khẩu
  - Làm mới token
  - Đăng xuất
  - Lấy thông tin tài khoản hiện tại
- Việc làm:
  - Danh sách công khai, tìm kiếm, lọc, xem chi tiết
  - Doanh nghiệp tạo, cập nhật, xóa mềm, đóng tin của chính mình
  - Quản trị viên duyệt hoặc từ chối tin chờ duyệt
- Việc làm đã lưu:
  - Lưu
  - Xem danh sách đã lưu
  - Xóa khỏi danh sách đã lưu
- Ứng tuyển:
  - Ứng tuyển kèm CV
  - Xem danh sách đơn của bản thân
  - Rút đơn
  - Doanh nghiệp xem ứng viên và cập nhật trạng thái
- Hồ sơ:
  - Ứng viên cập nhật trực tiếp
  - Doanh nghiệp gửi yêu cầu cập nhật để quản trị viên xét duyệt
- Báo cáo:
  - Ứng viên gửi báo cáo tin tuyển dụng
  - Quản trị viên xem danh sách và chi tiết báo cáo
- Quản trị:
  - Thống kê dashboard
  - Quản lý người dùng
  - Xét duyệt yêu cầu doanh nghiệp
  - Quản lý thẻ

### Đường dẫn backend quan trọng

- Khởi tạo app: `backend/src/app.js`
- Tập trung route: `backend/src/routes/index.js`
- Auth service: `backend/src/services/authService.js`
- Job service: `backend/src/services/jobService.js`
- Application service: `backend/src/services/applicationService.js`
- Seed script: `backend/scripts/seed.js`

## 4. Frontend

### Chức năng chính

- Trang công khai:
  - Trang chủ
  - Danh sách việc làm
  - Chi tiết việc làm
  - Đăng ký kèm xác minh email ngay trên giao diện
  - Đăng nhập
  - Quên mật khẩu
  - Đặt lại mật khẩu
- Khu vực ứng viên:
  - Bảng điều khiển
  - Hồ sơ cá nhân
  - Việc làm đã lưu
  - Danh sách và chi tiết đơn ứng tuyển
  - Báo cáo tin tuyển dụng
- Khu vực doanh nghiệp:
  - Bảng điều khiển
  - Hồ sơ doanh nghiệp
  - Gửi yêu cầu cập nhật
  - Quản lý tin tuyển dụng
  - Tạo và cập nhật tin
  - Xem ứng viên
- Khu vực quản trị:
  - Bảng điều khiển
  - Quản lý người dùng
  - Tin chờ duyệt
  - Yêu cầu doanh nghiệp
  - Báo cáo
  - Thẻ

### Đường dẫn frontend quan trọng

- Khởi tạo app: `frontend/src/main.jsx`
- Router: `frontend/src/routes/AppRouter.jsx`
- Auth context: `frontend/src/contexts/AuthContext.jsx`
- Axios client: `frontend/src/api/client.js`
- Schema kiểm tra dữ liệu dùng chung: `frontend/src/schemas.js`

## 5. Tệp môi trường

### Backend

Sao chép `backend/.env.example` thành `backend/.env`

```env
NODE_ENV=development
PORT=5000
CLIENT_URL=http://localhost:5173
MONGO_URI=mongodb://127.0.0.1:27017/online_job_searching_system
JWT_ACCESS_SECRET=replace-with-strong-access-secret
JWT_REFRESH_SECRET=replace-with-strong-refresh-secret
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
SMTP_HOST=
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=
SMTP_PASS=
MAIL_FROM=Online Job Searching System <no-reply@ojss.local>
```

Lưu ý:

- Nếu để trống thông tin SMTP, Nodemailer sẽ dùng JSON transport để phục vụ môi trường local.
- Ứng dụng không lưu mật khẩu Gmail trong dữ liệu hệ thống.

### Frontend

Sao chép `frontend/.env.example` thành `frontend/.env`

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

## 6. Dữ liệu mẫu

Đường dẫn script seed:

- `backend/scripts/seed.js`

Dữ liệu được tạo:

- 1 tài khoản quản trị viên
- 3 tài khoản doanh nghiệp
- 10 tài khoản ứng viên
- 15 thẻ
- 20 tin tuyển dụng với nhiều trạng thái
- một số việc làm đã lưu
- một số đơn ứng tuyển
- một số báo cáo
- một số yêu cầu cập nhật hồ sơ doanh nghiệp

### Tài khoản mặc định

- Quản trị viên
  - Tên đăng nhập: `admin`
  - Mật khẩu: `Admin@123`
- Doanh nghiệp
  - Tên đăng nhập: `enterprise1`
  - Mật khẩu: `Enterprise@123`
- Ứng viên
  - Tên đăng nhập: `jobseeker1`
  - Mật khẩu: `Jobseeker@123`

## 7. Hướng dẫn sử dụng

### Tính năng theo vai trò

- Khách truy cập
  - Xem việc làm công khai
  - Tìm kiếm và lọc việc làm
  - Xem chi tiết việc làm đang mở
  - Đăng ký và đăng nhập
- Ứng viên
  - Quản lý hồ sơ
  - Lưu việc làm
  - Ứng tuyển bằng CV
  - Theo dõi đơn ứng tuyển
  - Rút đơn
  - Báo cáo tin tuyển dụng
- Doanh nghiệp
  - Gửi thay đổi hồ sơ công ty để quản trị viên duyệt
  - Tạo, cập nhật, xóa và đóng tin tuyển dụng
  - Xem ứng viên
  - Cập nhật trạng thái ứng viên
- Quản trị viên
  - Duyệt tin tuyển dụng
  - Duyệt yêu cầu cập nhật doanh nghiệp
  - Quản lý người dùng
  - Xem báo cáo
  - Quản lý thẻ
  - Xem thống kê dashboard

### Cài đặt

#### Yêu cầu trước khi chạy

- Node.js 18 trở lên
- npm 9 trở lên
- MongoDB local hoặc MongoDB Atlas

#### Cài backend

```bash
cd backend
npm install
cp .env.example .env
npm run seed
npm run dev
```

#### Cài frontend

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

### Chạy dự án

- Backend: `http://localhost:5000`
- Frontend: `http://localhost:5173`

## 8. Tóm tắt API

### Auth

- `POST /api/auth/register`
- `POST /api/auth/verify-email`
- `POST /api/auth/login`
- `POST /api/auth/google-login`
- `POST /api/auth/forgot-password`
- `POST /api/auth/reset-password`
- `POST /api/auth/change-password`
- `POST /api/auth/logout`
- `POST /api/auth/refresh-token`
- `GET /api/auth/me`

### Jobs

- `GET /api/jobs`
- `GET /api/jobs/search`
- `GET /api/jobs/filter`
- `GET /api/jobs/:id`
- `POST /api/jobs`
- `PUT /api/jobs/:id`
- `DELETE /api/jobs/:id`
- `PATCH /api/jobs/:id/close`
- `GET /api/enterprise/jobs/my`

### Saved Jobs

- `POST /api/saved-jobs/:jobId`
- `GET /api/saved-jobs`
- `DELETE /api/saved-jobs/:jobId`

### Applications

- `POST /api/applications/:jobId`
- `GET /api/applications/my`
- `GET /api/applications/my/:id`
- `PATCH /api/applications/:id/withdraw`
- `GET /api/enterprise/applications`
- `GET /api/enterprise/jobs/:jobId/applications`
- `PATCH /api/enterprise/applications/:id/status`

### Profile

- `GET /api/profile/me`
- `PUT /api/profile/jobseeker`
- `PUT /api/profile/enterprise/request-update`
- `GET /api/profile/enterprise/request-status`

### Reports

- `POST /api/reports`
- `GET /api/admin/reports`
- `GET /api/admin/reports/:id`

### Admin

- `GET /api/admin/dashboard`
- `GET /api/admin/users`
- `GET /api/admin/users/:id`
- `PATCH /api/admin/users/:id/ban`
- `PATCH /api/admin/users/:id/unban`
- `DELETE /api/admin/users/:id`
- `GET /api/admin/jobs/pending`
- `PATCH /api/admin/jobs/:id/approve`
- `PATCH /api/admin/jobs/:id/reject`
- `GET /api/admin/enterprise-update-requests`
- `PATCH /api/admin/enterprise-update-requests/:id/approve`
- `PATCH /api/admin/enterprise-update-requests/:id/reject`

### Tags

- `GET /api/tags`
- `GET /api/admin/tags`
- `POST /api/admin/tags`
- `PUT /api/admin/tags/:id`
- `DELETE /api/admin/tags/:id`

## 9. Bộ sưu tập API

- Postman collection mẫu: `backend/postman/online-job-searching-system.collection.json`

## 10. Xác minh đã thực hiện

- Kiểm tra cú pháp backend
- Kiểm tra bootstrap app backend
- Build production frontend bằng `npm run build`

## 11. Hướng phát triển thêm

- Bổ sung MFA cho tài khoản doanh nghiệp
- Thay `prompt` và `confirm` bằng modal hoàn chỉnh hơn
- Thêm test tự động cho service và route
- Chuyển tải tệp lên cloud storage
- Bổ sung phân trang cho nhiều bảng dashboard hơn
- Nâng cấp template email và chiến lược retry gửi mail
- Thêm background jobs cho nhắc hạn và cảnh báo SLA
