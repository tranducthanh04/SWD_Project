import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { applicationsApi } from '../api/applicationsApi';
import { jobsApi } from '../api/jobsApi';
import { getErrorMessage } from '../formatters';
import LoadingSkeleton from '../components/shared/LoadingSkeleton';
import ErrorState from '../components/shared/ErrorState';
import StatusBadge from '../components/shared/StatusBadge';

function EnterpriseDashboardPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [jobs, applications] = await Promise.all([jobsApi.myJobs(), applicationsApi.enterpriseList()]);
        setData({ jobs: jobs.data, applications: applications.data });
      } catch (err) {
        setError(getErrorMessage(err, 'Không thể tải bảng điều khiển doanh nghiệp'));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <LoadingSkeleton rows={8} />;
  if (error) return <ErrorState description={error} />;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <div className="card-panel p-6">
          <div className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-700">Tổng tin tuyển dụng</div>
          <div className="mt-3 text-3xl font-bold text-slate-950">{data.jobs.length}</div>
        </div>
        <div className="card-panel p-6">
          <div className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-700">Đơn ứng tuyển</div>
          <div className="mt-3 text-3xl font-bold text-slate-950">{data.applications.length}</div>
        </div>
        <div className="card-panel p-6">
          <div className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-700">Đang chờ duyệt</div>
          <div className="mt-3 text-3xl font-bold text-slate-950">{data.jobs.filter((job) => job.status === 'Processing').length}</div>
        </div>
      </div>
      <div className="grid gap-6 xl:grid-cols-2">
        <div className="card-panel p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-slate-900">Tin gần đây</h2>
            <Link to="/enterprise/jobs" className="text-sm font-semibold text-brand-700">
              Quản lý
            </Link>
          </div>
          <div className="mt-4 space-y-3">
            {data.jobs.slice(0, 4).map((job) => (
              <div key={job._id} className="rounded-2xl border border-slate-200 p-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <div className="font-semibold text-slate-900">{job.title}</div>
                    <div className="text-sm text-slate-500">{job.location}</div>
                  </div>
                  <StatusBadge status={job.status} />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="card-panel p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-slate-900">Ứng viên gần đây</h2>
            <Link to="/enterprise/jobs" className="text-sm font-semibold text-brand-700">
              Xem xét
            </Link>
          </div>
          <div className="mt-4 space-y-3">
            {data.applications.slice(0, 4).map((application) => (
              <div key={application._id} className="rounded-2xl border border-slate-200 p-4">
                <div className="font-semibold text-slate-900">{application.jobSeeker?.fullName}</div>
                <div className="text-sm text-slate-500">{application.job?.title}</div>
                <div className="mt-2">
                  <StatusBadge status={application.status} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default EnterpriseDashboardPage;