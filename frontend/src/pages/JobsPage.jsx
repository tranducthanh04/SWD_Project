import { Link, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { jobsApi } from '../api/jobsApi';
import { experienceLevels, jobTypes } from '../constants';
import { currency, dateDisplay, getErrorMessage, displayExperienceLevel, displayJobType } from '../formatters';
import FilterPanel from '../components/shared/FilterPanel';
import SearchBar from '../components/shared/SearchBar';
import Pagination from '../components/shared/Pagination';
import StatusBadge from '../components/shared/StatusBadge';
import LoadingSkeleton from '../components/shared/LoadingSkeleton';
import EmptyState from '../components/shared/EmptyState';
import ErrorState from '../components/shared/ErrorState';

function JobsPage() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [filters, setFilters] = useState({
    city: searchParams.get('city') || '',
    jobType: searchParams.get('jobType') || '',
    experienceLevel: searchParams.get('experienceLevel') || '',
    salaryMin: searchParams.get('salaryMin') || '',
    salaryMax: searchParams.get('salaryMax') || '',
  });
  const [page, setPage] = useState(1);
  const [jobs, setJobs] = useState([]);
  const [meta, setMeta] = useState({ page: 1, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const jobTypeOptions = jobTypes.map((item) => ({ value: item, label: displayJobType(item) }));
  const experienceLevelOptions = experienceLevels.map((item) => ({ value: item, label: displayExperienceLevel(item) }));

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      try {
        const response = await jobsApi.list({ q: query, page, limit: 9, sort: query ? 'relevance' : 'latest', ...filters });
        setJobs(response.data);
        setMeta(response.meta || { page: 1, totalPages: 1 });
        setError('');
      } catch (err) {
        setError(getErrorMessage(err, 'Không thể tải danh sách việc làm'));
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [query, filters, page]);

  return (
    <div className="container-shell py-12">
      <div className="card-panel p-6">
        <div className="grid gap-4">
          <SearchBar value={query} onChange={setQuery} placeholder="Tìm theo chức danh, công ty, thẻ hoặc mô tả" />
          <FilterPanel
            filters={filters}
            onChange={(key, value) => setFilters((current) => ({ ...current, [key]: value }))}
            jobTypes={jobTypeOptions}
            experienceLevels={experienceLevelOptions}
          />
        </div>
      </div>

      <div className="mt-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-slate-950">Thị trường việc làm</h1>
        <p className="text-sm text-slate-500">Trang {meta.page || 1}</p>
      </div>

      <div className="mt-8">
        {loading ? <LoadingSkeleton rows={6} /> : null}
        {error ? <ErrorState description={error} /> : null}
        {!loading && !error && jobs.length === 0 ? (
          <EmptyState title="Không tìm thấy việc làm phù hợp" description="Hãy thử thay đổi từ khóa tìm kiếm hoặc bộ lọc." />
        ) : null}
        {!loading && !error && jobs.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {jobs.map((job) => (
              <article key={job._id} className="card-panel p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-700">{job.company?.companyName || 'Doanh nghiệp'}</div>
                    <h2 className="mt-2 text-xl font-semibold text-slate-900">{job.title}</h2>
                  </div>
                  <StatusBadge status={job.status} />
                </div>
                <p className="mt-4 line-clamp-3 text-sm text-slate-600">{job.overview}</p>
                <div className="mt-4 space-y-2 text-sm text-slate-500">
                  <div>{job.location}</div>
                  <div>{currency(job.salaryMin, job.salaryMax, job.currency)}</div>
                  <div>{displayJobType(job.jobType)} | {displayExperienceLevel(job.experienceLevel)}</div>
                  <div>Hạn nộp hồ sơ: {dateDisplay(job.applicationDeadline)}</div>
                </div>
                <div className="mt-5 flex flex-wrap gap-2">
                  {(job.tags || []).slice(0, 3).map((tag) => (
                    <span key={tag._id} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                      {tag.name}
                    </span>
                  ))}
                </div>
                <Link to={`/jobs/${job._id}`} className="btn-primary mt-6 w-full">
                  Xem chi tiết
                </Link>
              </article>
            ))}
          </div>
        ) : null}
      </div>

      <Pagination page={page} totalPages={meta.totalPages || 1} onChange={setPage} />
    </div>
  );
}

export default JobsPage;