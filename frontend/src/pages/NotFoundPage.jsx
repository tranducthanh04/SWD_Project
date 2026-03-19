import { Link } from 'react-router-dom';

function NotFoundPage() {
  return (
    <div className="container-shell py-24">
      <div className="card-panel mx-auto max-w-2xl p-10 text-center">
        <div className="text-sm font-semibold uppercase tracking-[0.3em] text-brand-700">404</div>
        <h1 className="mt-4 text-4xl font-black text-slate-950">Page not found</h1>
        <p className="mt-4 text-slate-500">The page you requested does not exist or is no longer available.</p>
        <Link to="/" className="btn-primary mt-8">
          Back to home
        </Link>
      </div>
    </div>
  );
}

export default NotFoundPage;
