import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { getDashboardPath } from '../../constants';

function Navbar() {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/85 backdrop-blur">
      <div className="container-shell flex items-center justify-between py-4">
        <Link to="/" className="flex items-center gap-3">
          <div className="rounded-2xl bg-brand-600 px-3 py-2 text-sm font-bold text-white">OJSS</div>
          <div>
            <div className="text-sm font-semibold uppercase tracking-[0.3em] text-brand-700">ONLINE JOB SEARCHING SYSTEM</div>
            <div className="text-xs text-slate-500">Recruitment platform for guests, candidates, enterprises, and admins</div>
          </div>
        </Link>
        <nav className="hidden items-center gap-6 text-sm font-medium text-slate-600 md:flex">
          <NavLink to="/jobs" className="hover:text-brand-600">
            Jobs
          </NavLink>
          <NavLink to="/search" className="hover:text-brand-600">
            Search
          </NavLink>
          {user ? (
            <>
              <NavLink to={getDashboardPath(user.role)} className="hover:text-brand-600">
                Dashboard
              </NavLink>
              <button onClick={logout} className="btn-secondary">
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className="hover:text-brand-600">
                Login
              </NavLink>
              <Link to="/register" className="btn-primary">
                Create account
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
