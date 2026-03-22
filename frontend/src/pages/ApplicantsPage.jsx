import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { applicationsApi } from '../api/applicationsApi';
import { applicationStatuses } from '../constants';
import { dateDisplay, displayStatus, getErrorMessage } from '../formatters';
import StatusBadge from '../components/shared/StatusBadge';
import LoadingSkeleton from '../components/shared/LoadingSkeleton';
import ErrorState from '../components/shared/ErrorState';

function ApplicantsPage() {
  const { jobId } = useParams();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadApplications = async () => {
    try {
      const response = await applicationsApi.byJob(jobId);
      setApplications(response.data);
      setError('');
    } catch (err) {
      setError(getErrorMessage(err, 'Không thể tải danh sách ứng viên'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadApplications();
  }, [jobId]);

  const handleStatusUpdate = async (id, status) => {
    const note = window.prompt('Nhập ghi chú cho ứng viên (nếu có):', '') || '';
    try {
      await applicationsApi.updateStatus(id, { status, note });
      toast.success('Đã cập nhật trạng thái đơn ứng tuyển');
      loadApplications();
    } catch (err) {
      toast.error(getErrorMessage(err, 'Không thể cập nhật đơn ứng tuyển'));
    }
  };

  if (loading) return <LoadingSkeleton rows={8} />;
  if (error) return <ErrorState description={error} />;

  return (
    <div className="space-y-4">
      {applications.map((application) => (
        <div key={application._id} className="card-panel p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-slate-900">{application.jobSeeker?.fullName}</h2>
              <div className="mt-2 text-sm text-slate-500">Ngày ứng tuyển: {dateDisplay(application.appliedAt)}</div>
              <div className="mt-2 text-sm text-slate-500">Email: {application.jobSeeker?.email}</div>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <StatusBadge status={application.status} />
              <a className="btn-secondary" href={`http://localhost:5000${application.cvFileUrl}`} target="_blank" rel="noreferrer">
                Mở CV
              </a>
              <select className="field-input w-56" defaultValue={application.status} onChange={(event) => handleStatusUpdate(application._id, event.target.value)}>
                {applicationStatuses.filter((item) => item !== 'Withdrawn').map((status) => (
                  <option key={status} value={status}>
                    {displayStatus(status)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default ApplicantsPage;