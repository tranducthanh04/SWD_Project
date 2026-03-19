import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { adminApi } from '../api/adminApi';
import { dateDisplay, getErrorMessage } from '../formatters';
import StatusBadge from '../components/shared/StatusBadge';
import LoadingSkeleton from '../components/shared/LoadingSkeleton';
import ErrorState from '../components/shared/ErrorState';

function AdminPendingJobsPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadJobs = async () => {
    try {
      const response = await adminApi.pendingJobs();
      setJobs(response.data);
      setError('');
    } catch (err) {
      setError(getErrorMessage(err, 'Unable to load pending jobs'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadJobs();
  }, []);

  const handleDecision = async (jobId, type) => {
    const note = window.prompt(`Add a note for this ${type} decision:`, '') || '';
    try {
      if (type === 'approve') {
        await adminApi.approveJob(jobId, note);
      } else {
        await adminApi.rejectJob(jobId, note);
      }
      toast.success(`Job ${type}d`);
      loadJobs();
    } catch (err) {
      toast.error(getErrorMessage(err, `Unable to ${type} job`));
    }
  };

  if (loading) return <LoadingSkeleton rows={8} />;
  if (error) return <ErrorState description={error} />;

  return (
    <div className="space-y-4">
      {jobs.map((job) => (
        <div key={job._id} className="card-panel p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-700">{job.company?.companyName || 'Enterprise'}</div>
              <h2 className="mt-2 text-xl font-semibold text-slate-900">{job.title}</h2>
              <div className="mt-2 text-sm text-slate-500">Deadline: {dateDisplay(job.applicationDeadline)}</div>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <StatusBadge status={job.status} />
              <button className="btn-secondary" onClick={() => handleDecision(job._id, 'approve')}>
                Approve
              </button>
              <button className="btn-primary" onClick={() => handleDecision(job._id, 'reject')}>
                Reject
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default AdminPendingJobsPage;
