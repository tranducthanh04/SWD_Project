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
        setError(getErrorMessage(err, 'Unable to load featured jobs'));
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
            <div className="inline-flex rounded-full border border-brand-200 bg-white/70 px-4 py-2 text-sm font-semibold text-brand-700">Production-style recruitment workflow</div>
            <h1 className="mt-6 max-w-3xl text-5xl font-black leading-tight text-slate-950">Find the right job, hire the right talent, and review the full process in one system.</h1>
            <p className="mt-6 max-w-2xl text-lg text-slate-600">Guests browse live roles, job seekers track applications, enterprises manage applicants, and admins control moderation and approvals.</p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link to="/jobs" className="btn-primary">
                Explore jobs
              </Link>
              <Link to="/register" className="btn-secondary">
                Create account
              </Link>
            </div>
          </div>
          <div className="card-panel overflow-hidden p-6">
            <div className="grid gap-4 md:grid-cols-2">
              {[
                ['Guests', 'Browse published jobs with search and filters.'],
                ['Job Seekers', 'Save jobs, apply with CV, report suspicious listings.'],
                ['Enterprises', 'Post jobs, review applicants, update statuses.'],
                ['Admins', 'Approve jobs, review enterprise changes, manage users.'],
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
            <h2 className="text-3xl font-bold text-slate-950">Featured live jobs</h2>
            <p className="mt-2 text-slate-500">Only approved, open, and non-expired roles are shown publicly.</p>
          </div>
          <Link to="/jobs" className="btn-secondary">
            View all jobs
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
                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-700">{job.company?.companyName || 'Enterprise'}</p>
                    <h3 className="mt-2 text-xl font-semibold text-slate-900">{job.title}</h3>
                  </div>
                  <StatusBadge status={job.status} />
                </div>
                <p className="mt-4 line-clamp-3 text-sm text-slate-600">{job.overview}</p>
                <div className="mt-4 space-y-2 text-sm text-slate-500">
                  <div>{job.location}</div>
                  <div>{currency(job.salaryMin, job.salaryMax, job.currency)}</div>
                  <div>Deadline: {dateDisplay(job.applicationDeadline)}</div>
                </div>
                <Link to={`/jobs/${job._id}`} className="btn-primary mt-6 w-full">
                  View detail
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
