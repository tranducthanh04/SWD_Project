import { NavLink } from 'react-router-dom';

const linkMap = {
  jobseeker: [
    { to: '/dashboard', label: 'Overview' },
    { to: '/profile', label: 'My Profile' },
    { to: '/saved-jobs', label: 'Saved Jobs' },
    { to: '/applications', label: 'Applications' },
  ],
  enterprise: [
    { to: '/enterprise', label: 'Overview' },
    { to: '/enterprise/profile', label: 'Company Profile' },
    { to: '/enterprise/jobs', label: 'Manage Jobs' },
    { to: '/enterprise/jobs/new', label: 'Post Job' },
    { to: '/enterprise/profile/request', label: 'Update Request' },
  ],
  admin: [
    { to: '/admin', label: 'Overview' },
    { to: '/admin/users', label: 'Users' },
    { to: '/admin/jobs', label: 'Pending Jobs' },
    { to: '/admin/enterprise-requests', label: 'Enterprise Requests' },
    { to: '/admin/reports', label: 'Reports' },
    { to: '/admin/tags', label: 'Tags' },
  ],
};

function DashboardSidebar({ role }) {
  const items = linkMap[role] || [];

  return (
    <aside className="card-panel h-fit p-4">
      <div className="mb-4 rounded-2xl bg-hero p-4">
        <div className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-700">{role}</div>
        <div className="mt-2 text-lg font-semibold text-slate-900">Workspace</div>
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
