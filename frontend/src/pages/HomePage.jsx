import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { jobsApi } from '../api/jobsApi';
import { currency, dateDisplay, getErrorMessage } from '../formatters';
import StatusBadge from '../components/shared/StatusBadge';
import LoadingSkeleton from '../components/shared/LoadingSkeleton';
import ErrorState from '../components/shared/ErrorState';

function HomePage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await jobsApi.list({ limit: 6, sort: 'latest' });
        setJobs(response.data);
      } catch (err) {
        setError(getErrorMessage(err, 'Không thể tải danh sách việc làm nổi bật'));
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  return (
    <div>
      <section className="bg-hero py-20">
        <div className="container-shell grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div>
            <div className="inline-flex rounded-full border border-brand-200 bg-white/70 px-4 py-2 text-sm font-semibold text-brand-700">
              Nền tảng tuyển dụng theo phong cách sản phẩm thực tế
            </div>
            <h1 className="mt-6 max-w-3xl text-5xl font-black leading-tight text-slate-950">
              Tìm đúng việc làm, tuyển đúng nhân sự và quản lý toàn bộ quy trình trên một hệ thống.
            </h1>
            <p className="mt-6 max-w-2xl text-lg text-slate-600">
              Khách truy cập xem việc làm đang tuyển, ứng viên theo dõi hồ sơ ứng tuyển, doanh nghiệp quản lý ứng viên và quản trị viên
              kiểm soát toàn bộ luồng kiểm duyệt.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link to="/jobs" className="btn-primary">
                Khám phá việc làm
              </Link>
              <Link to="/register" className="btn-secondary">
                Tạo tài khoản
              </Link>
            </div>
          </div>
          <div className="card-panel overflow-hidden p-6">
            <div className="grid gap-4 md:grid-cols-2">
              {[
                ['Khách truy cập', 'Xem các tin đã được duyệt với bộ lọc và tìm kiếm linh hoạt.'],
                ['Ứng viên', 'Lưu việc làm, ứng tuyển bằng CV và báo cáo tin đáng ngờ.'],
                ['Doanh nghiệp', 'Đăng tin tuyển dụng, xem ứng viên và cập nhật trạng thái hồ sơ.'],
                ['Quản trị viên', 'Duyệt tin tuyển dụng, xét duyệt cập nhật doanh nghiệp và quản lý người dùng.'],
              ].map(([title, description]) => (
                <div key={title} className="rounded-2xl border border-slate-200 p-4">
                  <div className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-700">{title}</div>
                  <p className="mt-3 text-sm text-slate-600">{description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="container-shell py-16">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold text-slate-950">Việc làm nổi bật đang tuyển</h2>
            <p className="mt-2 text-slate-500">Chỉ các vị trí đã được duyệt, còn mở và chưa hết hạn mới hiển thị công khai.</p>
          </div>
          <Link to="/jobs" className="btn-secondary">
            Xem tất cả việc làm
          </Link>
        </div>

        {loading ? <LoadingSkeleton rows={6} /> : null}
        {error ? <ErrorState description={error} /> : null}
        {!loading && !error ? (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {jobs.map((job) => (
              <article key={job._id} className="card-panel p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-700">{job.company?.companyName || 'Doanh nghiệp'}</p>
                    <h3 className="mt-2 text-xl font-semibold text-slate-900">{job.title}</h3>
                  </div>
                  <StatusBadge status={job.status} />
                </div>
                <p className="mt-4 line-clamp-3 text-sm text-slate-600">{job.overview}</p>
                <div className="mt-4 space-y-2 text-sm text-slate-500">
                  <div>{job.location}</div>
                  <div>{currency(job.salaryMin, job.salaryMax, job.currency)}</div>
                  <div>Hạn nộp hồ sơ: {dateDisplay(job.applicationDeadline)}</div>
                </div>
                <Link to={`/jobs/${job._id}`} className="btn-primary mt-6 w-full">
                  Xem chi tiết
                </Link>
              </article>
            ))}
          </div>
        ) : null}
      </section>
    </div>
  );
}

export default HomePage;