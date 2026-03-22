import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { applicationsApi } from '../api/applicationsApi';
import { dateDisplay, getErrorMessage } from '../formatters';
import StatusBadge from '../components/shared/StatusBadge';
import LoadingSkeleton from '../components/shared/LoadingSkeleton';
import ErrorState from '../components/shared/ErrorState';

function ApplicationDetailPage() {
  const { id } = useParams();
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchApplication = async () => {
      try {
        const response = await applicationsApi.detail(id);
        setApplication(response.data);
      } catch (err) {
        setError(getErrorMessage(err, 'Không thể tải chi tiết đơn ứng tuyển'));
      } finally {
        setLoading(false);
      }
    };

    fetchApplication();
  }, [id]);

  if (loading) return <LoadingSkeleton rows={7} />;
  if (error || !application) return <ErrorState description={error || 'Không tìm thấy đơn ứng tuyển'} />;

  return (
    <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
      <div className="card-panel p-6">
        <h1 className="text-2xl font-bold text-slate-950">{application.job?.title}</h1>
        <div className="mt-4 space-y-3 text-sm text-slate-600">
          <div>Ngày ứng tuyển: {dateDisplay(application.appliedAt)}</div>
          <div>
            CV:{' '}
            <a className="text-brand-700 underline" href={`http://localhost:5000${application.cvFileUrl}`} target="_blank" rel="noreferrer">
              Mở tệp CV
            </a>
          </div>
        </div>
        <div className="mt-4">
          <StatusBadge status={application.status} />
        </div>
      </div>
      <div className="card-panel p-6">
        <h2 className="text-xl font-semibold text-slate-900">Lịch sử trạng thái</h2>
        <div className="mt-4 space-y-4">
          {(application.history || []).map((entry, index) => (
            <div key={`${entry.status}-${index}`} className="rounded-2xl border border-slate-200 p-4">
              <div className="flex items-center justify-between gap-4">
                <StatusBadge status={entry.status} />
                <span className="text-sm text-slate-500">{dateDisplay(entry.changedAt)}</span>
              </div>
              <p className="mt-3 text-sm text-slate-600">{entry.note || 'Không có ghi chú'}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ApplicationDetailPage;