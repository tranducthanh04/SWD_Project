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
      setError(getErrorMessage(err, 'Không thể tải danh sách việc làm'));
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
      toast.success('Đã đóng tin tuyển dụng');
      loadJobs();
    } catch (err) {
      toast.error(getErrorMessage(err, 'Không thể đóng tin tuyển dụng'));
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc muốn xóa tin tuyển dụng này?')) return;
    try {
      await jobsApi.remove(id);
      toast.success('Đã xóa tin tuyển dụng');
      loadJobs();
    } catch (err) {
      toast.error(getErrorMessage(err, 'Không thể xóa tin tuyển dụng'));
    }
  };

  if (loading) return <LoadingSkeleton rows={8} />;
  if (error) return <ErrorState description={error} />;

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Link to="/enterprise/jobs/new" className="btn-primary">
          Đăng tin tuyển dụng mới
        </Link>
      </div>
      {jobs.map((job) => (
        <div key={job._id} className="card-panel p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-slate-900">{job.title}</h2>
              <div className="mt-2 text-sm text-slate-500">{job.location} | Ứng viên: {job.applicantCount}</div>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <StatusBadge status={job.status} />
              <Link className="btn-secondary" to={`/enterprise/jobs/${job._id}/edit`}>
                Chỉnh sửa
              </Link>
              <Link className="btn-secondary" to={`/enterprise/jobs/${job._id}/applicants`}>
                Ứng viên
              </Link>
              <button className="btn-secondary" onClick={() => handleClose(job._id)}>
                Đóng
              </button>
              <button className="btn-primary" onClick={() => handleDelete(job._id)}>
                Xóa
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default EnterpriseJobsPage;