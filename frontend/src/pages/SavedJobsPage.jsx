import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { savedJobsApi } from '../api/savedJobsApi';
import { currency, getErrorMessage } from '../formatters';
import LoadingSkeleton from '../components/shared/LoadingSkeleton';
import ErrorState from '../components/shared/ErrorState';
import EmptyState from '../components/shared/EmptyState';

function SavedJobsPage() {
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadSavedJobs = async () => {
    try {
      const response = await savedJobsApi.list();
      setSavedJobs(response.data);
      setError('');
    } catch (err) {
      setError(getErrorMessage(err, 'Unable to load saved jobs'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSavedJobs();
  }, []);

  const handleRemove = async (jobId) => {
    if (!window.confirm('Remove this saved job?')) return;
    try {
      await savedJobsApi.remove(jobId);
      toast.success('Saved job removed');
      loadSavedJobs();
    } catch (err) {
      toast.error(getErrorMessage(err, 'Unable to remove saved job'));
    }
  };

  if (loading) return <LoadingSkeleton rows={6} />;
  if (error) return <ErrorState description={error} />;
  if (!savedJobs.length) return <EmptyState title="No saved jobs yet" description="Save interesting roles from the public job detail page." />;

  return (
    <div className="space-y-4">
      {savedJobs.map((item) => (
        <div key={item._id} className="card-panel flex flex-col gap-4 p-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-700">{item.jobId?.company?.companyName || 'Enterprise'}</div>
            <h2 className="mt-2 text-xl font-semibold text-slate-900">{item.jobId?.title}</h2>
            <div className="mt-2 text-sm text-slate-500">{item.jobId?.location} | {currency(item.jobId?.salaryMin, item.jobId?.salaryMax, item.jobId?.currency)}</div>
          </div>
          <div className="flex gap-3">
            <Link className="btn-secondary" to={`/jobs/${item.jobId?._id}`}>
              View job
            </Link>
            <button className="btn-primary" onClick={() => handleRemove(item.jobId?._id)}>
              Remove
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default SavedJobsPage;
