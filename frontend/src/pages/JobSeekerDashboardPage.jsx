import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { applicationsApi } from '../api/applicationsApi';
import { profileApi } from '../api/profileApi';
import { savedJobsApi } from '../api/savedJobsApi';
import { jobsApi } from '../api/jobsApi';
import { getErrorMessage } from '../formatters';
import LoadingSkeleton from '../components/shared/LoadingSkeleton';
import ErrorState from '../components/shared/ErrorState';
import StatusBadge from '../components/shared/StatusBadge';

function JobSeekerDashboardPage() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profile, savedJobs, applications, recommendedJobs] = await Promise.all([
          profileApi.me(),
          savedJobsApi.list(),
          applicationsApi.mine(),
          jobsApi.list({ recommended: true, limit: 5 }),
        ]);

        setSummary({
          profile: profile.data,
          savedJobs: savedJobs.data,
          applications: applications.data,
          recommendedJobs: recommendedJobs.data,
        });
      } catch (err) {
        setError(getErrorMessage(err, 'Không thể tải bảng điều khiển'));
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
          <div className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-700">Việc làm đã lưu</div>
          <div className="mt-3 text-3xl font-bold text-slate-950">{summary.savedJobs.length}</div>
        </div>
        <div className="card-panel p-6">
          <div className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-700">Đơn ứng tuyển</div>
          <div className="mt-3 text-3xl font-bold text-slate-950">{summary.applications.length}</div>
        </div>
        <div className="card-panel p-6">
          <div className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-700">Hồ sơ</div>
          <div className="mt-3 text-xl font-bold text-slate-950">{summary.profile.profile?.profileCompleted ? 'Đã hoàn thiện' : 'Chưa hoàn thiện'}</div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <div className="card-panel p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-slate-900">Đơn ứng tuyển gần đây</h2>
            <Link to="/applications" className="text-sm font-semibold text-brand-700">
              Xem tất cả
            </Link>
          </div>
          <div className="mt-4 space-y-3">
            {summary.applications.slice(0, 4).map((application) => (
              <Link key={application._id} to={`/applications/${application._id}`} className="block rounded-2xl border border-slate-200 p-4 hover:border-brand-300">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <div className="font-semibold text-slate-900">{application.job?.title}</div>
                    <div className="text-sm text-slate-500">{application.job?.location}</div>
                  </div>
                  <StatusBadge status={application.status} />
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="card-panel p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-slate-900">Việc làm gợi ý</h2>
            <Link to="/jobs" className="text-sm font-semibold text-brand-700">
              Khám phá
            </Link>
          </div>
          <div className="mt-4 space-y-3">
            {summary.recommendedJobs.slice(0, 4).map((job) => (
              <Link key={job._id} to={`/jobs/${job._id}`} className="block rounded-2xl border border-slate-200 p-4 hover:border-brand-300">
                <div className="font-semibold text-slate-900">{job.title}</div>
                <div className="mt-1 text-sm text-slate-500">{job.company?.companyName || 'Doanh nghiệp'}</div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default JobSeekerDashboardPage;