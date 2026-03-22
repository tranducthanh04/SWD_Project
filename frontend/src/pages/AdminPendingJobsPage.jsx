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
      setError(getErrorMessage(err, 'Không thể tải danh sách tin chờ duyệt'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadJobs();
  }, []);

  const handleDecision = async (jobId, type) => {
    const note = window.prompt(`Nhập ghi chú cho quyết định ${type === 'approve' ? 'duyệt' : 'từ chối'}:`, '') || '';
    try {
      if (type === 'approve') {
        await adminApi.approveJob(jobId, note);
        toast.success('Đã duyệt tin tuyển dụng');
      } else {
        await adminApi.rejectJob(jobId, note);
        toast.success('Đã từ chối tin tuyển dụng');
      }
      loadJobs();
    } catch (err) {
      toast.error(getErrorMessage(err, type === 'approve' ? 'Không thể duyệt tin tuyển dụng' : 'Không thể từ chối tin tuyển dụng'));
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
              <div className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-700">{job.company?.companyName || 'Doanh nghiệp'}</div>
              <h2 className="mt-2 text-xl font-semibold text-slate-900">{job.title}</h2>
              <div className="mt-2 text-sm text-slate-500">Hạn nộp hồ sơ: {dateDisplay(job.applicationDeadline)}</div>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <StatusBadge status={job.status} />
              <button className="btn-secondary" onClick={() => handleDecision(job._id, 'approve')}>
                Duyệt
              </button>
              <button className="btn-primary" onClick={() => handleDecision(job._id, 'reject')}>
                Từ chối
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default AdminPendingJobsPage;