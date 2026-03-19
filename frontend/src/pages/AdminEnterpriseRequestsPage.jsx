import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { adminApi } from '../api/adminApi';
import { getErrorMessage } from '../formatters';
import StatusBadge from '../components/shared/StatusBadge';
import LoadingSkeleton from '../components/shared/LoadingSkeleton';
import ErrorState from '../components/shared/ErrorState';

function AdminEnterpriseRequestsPage() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadRequests = async () => {
    try {
      const response = await adminApi.enterpriseUpdateRequests();
      setRequests(response.data);
      setError('');
    } catch (err) {
      setError(getErrorMessage(err, 'Unable to load enterprise requests'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const handleDecision = async (id, type) => {
    const note = window.prompt(`Add a note for this ${type} decision:`, '') || '';
    try {
      if (type === 'approve') {
        await adminApi.approveEnterpriseRequest(id, note);
      } else {
        await adminApi.rejectEnterpriseRequest(id, note);
      }
      toast.success(`Request ${type}d`);
      loadRequests();
    } catch (err) {
      toast.error(getErrorMessage(err, `Unable to ${type} request`));
    }
  };

  if (loading) return <LoadingSkeleton rows={8} />;
  if (error) return <ErrorState description={error} />;

  return (
    <div className="space-y-4">
      {requests.map((request) => (
        <div key={request._id} className="card-panel p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="text-lg font-semibold text-slate-900">{request.enterpriseId?.fullName}</div>
              <div className="text-sm text-slate-500">{request.enterpriseId?.email}</div>
              <div className="mt-2 text-sm text-slate-500">Requested company name: {request.newData?.companyName || '-'}</div>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <StatusBadge status={request.status} />
              {request.status === 'pending' ? (
                <>
                  <button className="btn-secondary" onClick={() => handleDecision(request._id, 'approve')}>
                    Approve
                  </button>
                  <button className="btn-primary" onClick={() => handleDecision(request._id, 'reject')}>
                    Reject
                  </button>
                </>
              ) : null}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default AdminEnterpriseRequestsPage;
