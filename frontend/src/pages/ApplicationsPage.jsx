import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { applicationsApi } from '../api/applicationsApi';
import { dateDisplay, getErrorMessage } from '../formatters';
import StatusBadge from '../components/shared/StatusBadge';
import LoadingSkeleton from '../components/shared/LoadingSkeleton';
import ErrorState from '../components/shared/ErrorState';
import EmptyState from '../components/shared/EmptyState';

function ApplicationsPage() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadApplications = async () => {
    try {
      const response = await applicationsApi.mine();
      setApplications(response.data);
      setError('');
    } catch (err) {
      setError(getErrorMessage(err, 'Unable to load applications'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadApplications();
  }, []);

  const handleWithdraw = async (id) => {
    if (!window.confirm('Withdraw this application?')) return;
    try {
      await applicationsApi.withdraw(id);
      toast.success('Application withdrawn');
      loadApplications();
    } catch (err) {
      toast.error(getErrorMessage(err, 'Unable to withdraw application'));
    }
  };

  if (loading) return <LoadingSkeleton rows={6} />;
  if (error) return <ErrorState description={error} />;
  if (!applications.length) return <EmptyState title="No applications yet" description="Apply to a published role to start tracking your process." />;

  return (
    <div className="space-y-4">
      {applications.map((application) => (
        <div key={application._id} className="card-panel p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-slate-900">{application.job?.title}</h2>
              <div className="mt-2 text-sm text-slate-500">Applied: {dateDisplay(application.appliedAt)}</div>
              <div className="mt-2 text-sm text-slate-500">SLA: {application.responseSla?.businessDaysElapsed}/{application.responseSla?.targetDays} business days</div>
            </div>
            <div className="flex items-center gap-3">
              <StatusBadge status={application.status} />
              <Link className="btn-secondary" to={`/applications/${application._id}`}>
                Detail
              </Link>
              {!application.isWithdrawn ? (
                <button className="btn-primary" onClick={() => handleWithdraw(application._id)}>
                  Withdraw
                </button>
              ) : null}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default ApplicationsPage;
