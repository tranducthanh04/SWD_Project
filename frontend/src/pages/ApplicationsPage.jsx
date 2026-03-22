import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { applicationsApi } from '../api/applicationsApi';
import { dateDisplay, getErrorMessage } from '../formatters';
import StatusBadge from '../components/shared/StatusBadge';
import LoadingSkeleton from '../components/shared/LoadingSkeleton';
import ErrorState from '../components/shared/ErrorState';
import EmptyState from '../components/shared/EmptyState';

function ApplicationsPage() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadApplications = async () => {
    try {
      const response = await applicationsApi.mine();
      setApplications(response.data);
      setError('');
    } catch (err) {
      setError(getErrorMessage(err, 'Không thể tải đơn ứng tuyển'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadApplications();
  }, []);

  const handleWithdraw = async (id) => {
    if (!window.confirm('Bạn có chắc muốn rút đơn ứng tuyển này?')) return;
    try {
      await applicationsApi.withdraw(id);
      toast.success('Đã rút đơn ứng tuyển');
      loadApplications();
    } catch (err) {
      toast.error(getErrorMessage(err, 'Không thể rút đơn ứng tuyển'));
    }
  };

  if (loading) return <LoadingSkeleton rows={6} />;
  if (error) return <ErrorState description={error} />;
  if (!applications.length) {
    return <EmptyState title="Chưa có đơn ứng tuyển" description="Hãy ứng tuyển vào các vị trí đang tuyển để bắt đầu theo dõi quá trình." />;
  }

  return (
    <div className="space-y-4">
      {applications.map((application) => (
        <div key={application._id} className="card-panel p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-slate-900">{application.job?.title}</h2>
              <div className="mt-2 text-sm text-slate-500">Ngày ứng tuyển: {dateDisplay(application.appliedAt)}</div>
              <div className="mt-2 text-sm text-slate-500">
                SLA phản hồi: {application.responseSla?.businessDaysElapsed}/{application.responseSla?.targetDays} ngày làm việc
              </div>
            </div>
            <div className="flex items-center gap-3">
              <StatusBadge status={application.status} />
              <Link className="btn-secondary" to={`/applications/${application._id}`}>
                Chi tiết
              </Link>
              {!application.isWithdrawn ? (
                <button className="btn-primary" onClick={() => handleWithdraw(application._id)}>
                  Rút đơn
                </button>
              ) : null}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default ApplicationsPage;