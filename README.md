# ONLINE JOB SEARCHING SYSTEM

## 1. Final Architecture Explanation

This project is a full-stack recruitment platform with a separated React/Vite frontend and Node.js/Express backend.

- Frontend:
  - React 19 + Vite
  - Tailwind CSS
  - React Router
  - Axios
  - Context API for auth/session state
  - React Hook Form + Zod for form validation
- Backend:
  - Express.js REST API
  - MongoDB + Mongoose
  - JWT access token + refresh token flow
  - bcrypt password hashing
  - Nodemailer email service with JSON transport fallback for local development
  - multer local file upload storage
  - express-validator request validation
- Roles:
  - Guest
  - JobSeeker
  - Enterprise
  - Admin

### Architectural Notes

- Public job visibility is restricted to `Published` jobs that are still open and not expired.
- Job creation and job updates are moderated by admins through a `Processing -> Published/Rejected` workflow.
- Enterprise profile changes go through `EnterpriseProfileUpdateRequest`.
- JobSeeker applications store full history and enforce no reapply after withdrawal.
- Sensitive contact information is never exposed on public-facing job pages.
- Audit logs are stored for important enterprise/admin actions.

## 2. Folder Structure

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

### Main Backend Capabilities

- Auth:
  - Register
  - Verify email
  - Login
  - Google login placeholder structure
  - Forgot/reset password
  - Change password
  - Refresh token
  - Logout
  - `me`
- Jobs:
  - Public list, search, filter, detail
  - Enterprise create/update/delete/close own jobs
  - Admin approve/reject pending jobs
- Saved jobs:
  - Save
  - List saved jobs
  - Remove saved job
- Applications:
  - Apply with CV
  - View own applications
  - Withdraw application
  - Enterprise applicant review and status update
- Profiles:
  - JobSeeker direct update
  - Enterprise update request workflow
- Reports:
  - JobSeeker report submission
  - Admin report list/detail
- Admin:
  - Dashboard metrics
  - User management
  - Enterprise request review
  - Tag management

### Important Backend Paths

- API bootstrap: `backend/src/app.js`
- Route registry: `backend/src/routes/index.js`
- Auth service: `backend/src/services/authService.js`
- Job service: `backend/src/services/jobService.js`
- Application service: `backend/src/services/applicationService.js`
- Seed script: `backend/scripts/seed.js`

## 4. Frontend

### Main Frontend Capabilities

- Public pages:
  - Home
  - Job list
  - Job detail
  - Register with inline email verification
  - Login
  - Forgot password
  - Reset password
- JobSeeker pages:
  - Dashboard
  - Profile update
  - Saved jobs
  - Applications list/detail
  - Report job
- Enterprise pages:
  - Dashboard
  - Company profile
  - Update request
  - Manage jobs
  - Create/update job
  - Applicant review
- Admin pages:
  - Dashboard
  - Users
  - Pending jobs
  - Enterprise requests
  - Reports
  - Tags

### Important Frontend Paths

- App bootstrap: `frontend/src/main.jsx`
- Router: `frontend/src/routes/AppRouter.jsx`
- Auth context: `frontend/src/contexts/AuthContext.jsx`
- Axios client: `frontend/src/api/client.js`
- Shared validation schemas: `frontend/src/schemas.js`

## 5. Environment Files

### Backend

Copy `backend/.env.example` to `backend/.env`

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

Notes:

- If SMTP values are empty, Nodemailer falls back to JSON transport for local development.
- No Gmail password is stored anywhere in application data.

### Frontend

Copy `frontend/.env.example` to `frontend/.env`

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

## 6. Seed Data

Seed script path:

- `backend/scripts/seed.js`

Generated data:

- 1 admin account
- 3 enterprise accounts
- 10 jobseeker accounts
- 15 tags
- 20 jobs with mixed statuses
- saved jobs
- applications
- reports
- enterprise profile update requests

### Default Accounts

- Admin
  - Username: `admin`
  - Password: `Admin@123`
- Enterprise
  - Username: `enterprise1`
  - Password: `Enterprise@123`
- JobSeeker
  - Username: `jobseeker1`
  - Password: `Jobseeker@123`

## 7. README

### Features by Role

- Guest
  - Browse public jobs
  - Search and filter jobs
  - View open job details
  - Register and login
- JobSeeker
  - Manage profile
  - Save jobs
  - Apply with CV
  - Track applications
  - Withdraw applications
  - Report jobs
- Enterprise
  - Submit company profile changes for admin approval
  - Create/update/delete/close jobs
  - Review applicants
  - Update applicant statuses
- Admin
  - Review jobs
  - Review enterprise update requests
  - Manage users
  - Review reports
  - Manage tags
  - View dashboard statistics

### Installation

#### Prerequisites

- Node.js 18+
- npm 9+
- MongoDB local instance or MongoDB Atlas connection

#### Backend Setup

```bash
cd backend
npm install
cp .env.example .env
npm run seed
npm run dev
```

#### Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

### Running the Project

- Backend: `http://localhost:5000`
- Frontend: `http://localhost:5173`

### API Summary

#### Auth

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

#### Jobs

- `GET /api/jobs`
- `GET /api/jobs/search`
- `GET /api/jobs/filter`
- `GET /api/jobs/:id`
- `POST /api/jobs`
- `PUT /api/jobs/:id`
- `DELETE /api/jobs/:id`
- `PATCH /api/jobs/:id/close`
- `GET /api/enterprise/jobs/my`

#### Saved Jobs

- `POST /api/saved-jobs/:jobId`
- `GET /api/saved-jobs`
- `DELETE /api/saved-jobs/:jobId`

#### Applications

- `POST /api/applications/:jobId`
- `GET /api/applications/my`
- `GET /api/applications/my/:id`
- `PATCH /api/applications/:id/withdraw`
- `GET /api/enterprise/applications`
- `GET /api/enterprise/jobs/:jobId/applications`
- `PATCH /api/enterprise/applications/:id/status`

#### Profile

- `GET /api/profile/me`
- `PUT /api/profile/jobseeker`
- `PUT /api/profile/enterprise/request-update`
- `GET /api/profile/enterprise/request-status`

#### Reports

- `POST /api/reports`
- `GET /api/admin/reports`
- `GET /api/admin/reports/:id`

#### Admin

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

#### Tags

- `GET /api/tags`
- `GET /api/admin/tags`
- `POST /api/admin/tags`
- `PUT /api/admin/tags/:id`
- `DELETE /api/admin/tags/:id`

### API Collection

Sample Postman collection:

- `backend/postman/online-job-searching-system.collection.json`

### Verification Performed

- Backend syntax check on backend source files
- Backend app bootstrap import check
- Frontend production build succeeded with `npm run build`

### Future Improvements

- Add MFA for enterprise accounts
- Replace prompt/confirm based admin actions with richer modal workflows
- Add automated tests for services and route integration
- Move file uploads to cloud storage
- Add pagination to more dashboard tables
- Add email template branding and delivery retry strategy
- Add background jobs for reminders and SLA alerts
