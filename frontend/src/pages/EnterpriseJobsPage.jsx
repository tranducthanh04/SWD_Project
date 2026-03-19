import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { jobsApi } from '../api/jobsApi';
import { getErrorMessage } from '../formatters';
import StatusBadge from '../components/shared/StatusBadge';
import LoadingSkeleton from '../components/shared/LoadingSkeleton';
import ErrorState from '../components/shared/ErrorState';

function EnterpriseJobsPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadJobs = async () => {
    try {
      const response = await jobsApi.myJobs();
      setJobs(response.data);
      setError('');
    } catch (err) {
      setError(getErrorMessage(err, 'Unable to load jobs'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadJobs();
  }, []);

  const handleClose = async (id) => {
    try {
      await jobsApi.close(id);
      toast.success('Job closed');
      loadJobs();
    } catch (err) {
      toast.error(getErrorMessage(err, 'Unable to close job'));
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this job?')) return;
    try {
      await jobsApi.remove(id);
      toast.success('Job deleted');
      loadJobs();
    } catch (err) {
      toast.error(getErrorMessage(err, 'Unable to delete job'));
    }
  };

  if (loading) return <LoadingSkeleton rows={8} />;
  if (error) return <ErrorState description={error} />;

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Link to="/enterprise/jobs/new" className="btn-primary">
          Post a new job
        </Link>
      </div>
      {jobs.map((job) => (
        <div key={job._id} className="card-panel p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-slate-900">{job.title}</h2>
              <div className="mt-2 text-sm text-slate-500">{job.location} | Applicants: {job.applicantCount}</div>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <StatusBadge status={job.status} />
              <Link className="btn-secondary" to={`/enterprise/jobs/${job._id}/edit`}>
                Edit
              </Link>
              <Link className="btn-secondary" to={`/enterprise/jobs/${job._id}/applicants`}>
                Applicants
              </Link>
              <button className="btn-secondary" onClick={() => handleClose(job._id)}>
                Close
              </button>
              <button className="btn-primary" onClick={() => handleDelete(job._id)}>
                Delete
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default EnterpriseJobsPage;
