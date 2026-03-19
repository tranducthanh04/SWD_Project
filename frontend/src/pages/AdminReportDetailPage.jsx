import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { adminApi } from '../api/adminApi';
import { dateDisplay, getErrorMessage } from '../formatters';
import StatusBadge from '../components/shared/StatusBadge';
import LoadingSkeleton from '../components/shared/LoadingSkeleton';
import ErrorState from '../components/shared/ErrorState';

function AdminReportDetailPage() {
  const { id } = useParams();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const response = await adminApi.reportDetail(id);
        setReport(response.data);
      } catch (err) {
        setError(getErrorMessage(err, 'Unable to load report detail'));
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [id]);

  if (loading) return <LoadingSkeleton rows={7} />;
  if (error || !report) return <ErrorState description={error || 'Report not found'} />;

  return (
    <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
      <div className="card-panel p-6">
        <h1 className="text-2xl font-bold text-slate-950">{report.title}</h1>
        <div className="mt-4 space-y-3 text-sm text-slate-600">
          <div>Reporter: {report.reporter?.fullName}</div>
          <div>Email: {report.reporter?.email}</div>
          <div>Created: {dateDisplay(report.createdAt)}</div>
        </div>
        <div className="mt-4">
          <StatusBadge status={report.status} />
        </div>
      </div>
      <div className="card-panel p-6">
        <h2 className="text-xl font-semibold text-slate-900">Content</h2>
        <p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-slate-600">{report.content}</p>
        <div className="mt-6 rounded-2xl border border-slate-200 p-4 text-sm text-slate-600">
          <div className="font-semibold text-slate-900">Reported job</div>
          <div className="mt-2">{report.job?.title}</div>
        </div>
      </div>
    </div>
  );
}

export default AdminReportDetailPage;
