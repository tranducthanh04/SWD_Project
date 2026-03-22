import { NavLink } from 'react-router-dom';
import { roleLabels } from '../../constants';

const linkMap = {
  jobseeker: [
    { to: '/dashboard', label: 'Tổng quan' },
    { to: '/profile', label: 'Hồ sơ của tôi' },
    { to: '/saved-jobs', label: 'Việc làm đã lưu' },
    { to: '/applications', label: 'Đơn ứng tuyển' },
  ],
  enterprise: [
    { to: '/enterprise', label: 'Tổng quan' },
    { to: '/enterprise/profile', label: 'Hồ sơ doanh nghiệp' },
    { to: '/enterprise/jobs', label: 'Quản lý tin tuyển dụng' },
    { to: '/enterprise/jobs/new', label: 'Đăng tin tuyển dụng' },
    { to: '/enterprise/profile/request', label: 'Yêu cầu cập nhật' },
  ],
  admin: [
    { to: '/admin', label: 'Tổng quan' },
    { to: '/admin/users', label: 'Người dùng' },
    { to: '/admin/jobs', label: 'Tin chờ duyệt' },
    { to: '/admin/enterprise-requests', label: 'Yêu cầu doanh nghiệp' },
    { to: '/admin/reports', label: 'Báo cáo' },
    { to: '/admin/tags', label: 'Thẻ' },
  ],
};

function DashboardSidebar({ role }) {
  const items = linkMap[role] || [];

  return (
    <aside className="card-panel h-fit p-4">
      <div className="mb-4 rounded-2xl bg-hero p-4">
        <div className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-700">{roleLabels[role] || role}</div>
        <div className="mt-2 text-lg font-semibold text-slate-900">Khu vực làm việc</div>
      </div>
      <nav className="space-y-2">
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/dashboard' || item.to === '/enterprise' || item.to === '/admin'}
            className={({ isActive }) =>
              `block rounded-2xl px-4 py-3 text-sm font-medium transition ${
                isActive ? 'bg-brand-600 text-white' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

export default DashboardSidebar;