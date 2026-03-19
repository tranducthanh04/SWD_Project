import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { adminApi } from '../api/adminApi';
import { getErrorMessage } from '../formatters';
import StatusBadge from '../components/shared/StatusBadge';
import LoadingSkeleton from '../components/shared/LoadingSkeleton';
import ErrorState from '../components/shared/ErrorState';

function AdminReportsPage() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await adminApi.reports();
        setReports(response.data);
      } catch (err) {
        setError(getErrorMessage(err, 'Unable to load reports'));
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  if (loading) return <LoadingSkeleton rows={8} />;
  if (error) return <ErrorState description={error} />;

  return (
    <div className="space-y-4">
      {reports.map((report) => (
        <Link key={report._id} to={`/admin/reports/${report._id}`} className="card-panel block p-6 hover:border-brand-300">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="text-lg font-semibold text-slate-900">{report.title}</div>
              <div className="mt-2 text-sm text-slate-500">Reporter: {report.reporter?.fullName}</div>
              <div className="mt-1 text-sm text-slate-500">Job: {report.job?.title}</div>
            </div>
            <StatusBadge status={report.status} />
          </div>
        </Link>
      ))}
    </div>
  );
}

export default AdminReportsPage;
