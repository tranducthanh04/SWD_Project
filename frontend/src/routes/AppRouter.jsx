import { Navigate, Route, Routes } from 'react-router-dom';
import ProtectedRoute from '../components/shared/ProtectedRoute';
import RoleRoute from '../components/shared/RoleRoute';
import DashboardLayout from '../layouts/DashboardLayout';
import PublicLayout from '../layouts/PublicLayout';
import ApplicationDetailPage from '../pages/ApplicationDetailPage';
import ApplicationsPage from '../pages/ApplicationsPage';
import ApplicantsPage from '../pages/ApplicantsPage';
import EnterpriseDashboardPage from '../pages/EnterpriseDashboardPage';
import EnterpriseJobFormPage from '../pages/EnterpriseJobFormPage';
import EnterpriseJobsPage from '../pages/EnterpriseJobsPage';
import EnterpriseProfilePage from '../pages/EnterpriseProfilePage';
import AdminDashboardPage from '../pages/AdminDashboardPage';
import AdminEnterpriseRequestsPage from '../pages/AdminEnterpriseRequestsPage';
import AdminPendingJobsPage from '../pages/AdminPendingJobsPage';
import AdminReportDetailPage from '../pages/AdminReportDetailPage';
import AdminReportsPage from '../pages/AdminReportsPage';
import AdminTagsPage from '../pages/AdminTagsPage';
import AdminUserDetailPage from '../pages/AdminUserDetailPage';
import AdminUsersPage from '../pages/AdminUsersPage';
import ForgotPasswordPage from '../pages/ForgotPasswordPage';
import HomePage from '../pages/HomePage';
import JobDetailPage from '../pages/JobDetailPage';
import JobsPage from '../pages/JobsPage';
import JobSeekerDashboardPage from '../pages/JobSeekerDashboardPage';
import LoginPage from '../pages/LoginPage';
import NotFoundPage from '../pages/NotFoundPage';
import ProfilePage from '../pages/ProfilePage';
import RegisterPage from '../pages/RegisterPage';
import ReportJobPage from '../pages/ReportJobPage';
import ResetPasswordPage from '../pages/ResetPasswordPage';
import SavedJobsPage from '../pages/SavedJobsPage';

function AppRouter() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/jobs" element={<JobsPage />} />
        <Route path="/search" element={<JobsPage />} />
        <Route path="/jobs/:id" element={<JobDetailPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
      </Route>

      <Route
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route
          path="/dashboard"
          element={
            <RoleRoute roles={['jobseeker']}>
              <JobSeekerDashboardPage />
            </RoleRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <RoleRoute roles={['jobseeker']}>
              <ProfilePage />
            </RoleRoute>
          }
        />
        <Route
          path="/saved-jobs"
          element={
            <RoleRoute roles={['jobseeker']}>
              <SavedJobsPage />
            </RoleRoute>
          }
        />
        <Route
          path="/applications"
          element={
            <RoleRoute roles={['jobseeker']}>
              <ApplicationsPage />
            </RoleRoute>
          }
        />
        <Route
          path="/applications/:id"
          element={
            <RoleRoute roles={['jobseeker']}>
              <ApplicationDetailPage />
            </RoleRoute>
          }
        />
        <Route
          path="/jobs/:id/report"
          element={
            <RoleRoute roles={['jobseeker']}>
              <ReportJobPage />
            </RoleRoute>
          }
        />

        <Route
          path="/enterprise"
          element={
            <RoleRoute roles={['enterprise']}>
              <EnterpriseDashboardPage />
            </RoleRoute>
          }
        />
        <Route
          path="/enterprise/profile"
          element={
            <RoleRoute roles={['enterprise']}>
              <EnterpriseProfilePage />
            </RoleRoute>
          }
        />
        <Route
          path="/enterprise/profile/request"
          element={
            <RoleRoute roles={['enterprise']}>
              <EnterpriseProfilePage mode="request" />
            </RoleRoute>
          }
        />
        <Route
          path="/enterprise/jobs"
          element={
            <RoleRoute roles={['enterprise']}>
              <EnterpriseJobsPage />
            </RoleRoute>
          }
        />
        <Route
          path="/enterprise/jobs/new"
          element={
            <RoleRoute roles={['enterprise']}>
              <EnterpriseJobFormPage />
            </RoleRoute>
          }
        />
        <Route
          path="/enterprise/jobs/:jobId/edit"
          element={
            <RoleRoute roles={['enterprise']}>
              <EnterpriseJobFormPage />
            </RoleRoute>
          }
        />
        <Route
          path="/enterprise/jobs/:jobId/applicants"
          element={
            <RoleRoute roles={['enterprise']}>
              <ApplicantsPage />
            </RoleRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <RoleRoute roles={['admin']}>
              <AdminDashboardPage />
            </RoleRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <RoleRoute roles={['admin']}>
              <AdminUsersPage />
            </RoleRoute>
          }
        />
        <Route
          path="/admin/users/:id"
          element={
            <RoleRoute roles={['admin']}>
              <AdminUserDetailPage />
            </RoleRoute>
          }
        />
        <Route
          path="/admin/jobs"
          element={
            <RoleRoute roles={['admin']}>
              <AdminPendingJobsPage />
            </RoleRoute>
          }
        />
        <Route
          path="/admin/enterprise-requests"
          element={
            <RoleRoute roles={['admin']}>
              <AdminEnterpriseRequestsPage />
            </RoleRoute>
          }
        />
        <Route
          path="/admin/reports"
          element={
            <RoleRoute roles={['admin']}>
              <AdminReportsPage />
            </RoleRoute>
          }
        />
        <Route
          path="/admin/reports/:id"
          element={
            <RoleRoute roles={['admin']}>
              <AdminReportDetailPage />
            </RoleRoute>
          }
        />
        <Route
          path="/admin/tags"
          element={
            <RoleRoute roles={['admin']}>
              <AdminTagsPage />
            </RoleRoute>
          }
        />
      </Route>

      <Route path="*" element={<NotFoundPage />} />
      <Route path="/home" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default AppRouter;
