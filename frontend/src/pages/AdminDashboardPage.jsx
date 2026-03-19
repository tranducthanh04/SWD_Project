import { useEffect, useState } from 'react';
import { adminApi } from '../api/adminApi';
import { getErrorMessage } from '../formatters';
import LoadingSkeleton from '../components/shared/LoadingSkeleton';
import ErrorState from '../components/shared/ErrorState';

function AdminDashboardPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await adminApi.dashboard();
        setStats(response.data);
      } catch (err) {
        setError(getErrorMessage(err, 'Unable to load admin dashboard'));
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return <LoadingSkeleton rows={8} />;
  if (error) return <ErrorState description={error} />;

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {Object.entries(stats).map(([key, value]) => (
        <div key={key} className="card-panel p-6">
          <div className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-700">{key.replace(/([A-Z])/g, ' $1')}</div>
          <div className="mt-3 text-3xl font-bold text-slate-950">{value}</div>
        </div>
      ))}
    </div>
  );
}

export default AdminDashboardPage;
