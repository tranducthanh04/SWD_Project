import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { adminApi } from '../api/adminApi';
import { getErrorMessage } from '../formatters';
import LoadingSkeleton from '../components/shared/LoadingSkeleton';
import ErrorState from '../components/shared/ErrorState';
import StatusBadge from '../components/shared/StatusBadge';

function AdminUserDetailPage() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await adminApi.userDetail(id);
        setUser(response.data);
      } catch (err) {
        setError(getErrorMessage(err, 'Unable to load user detail'));
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  if (loading) return <LoadingSkeleton rows={6} />;
  if (error || !user) return <ErrorState description={error || 'User not found'} />;

  return (
    <div className="card-panel p-6">
      <h1 className="text-2xl font-bold text-slate-950">{user.fullName}</h1>
      <div className="mt-6 grid gap-4 md:grid-cols-2 text-sm text-slate-600">
        <div>Email: {user.email}</div>
        <div>Username: {user.username}</div>
        <div>Role: {user.role}</div>
        <div>Phone: {user.phone || '-'}</div>
        <div>Address: {user.address || '-'}</div>
        <div>Status: <StatusBadge status={user.isBanned ? 'Banned' : user.isActive ? 'Active' : 'Inactive'} /></div>
      </div>
    </div>
  );
}

export default AdminUserDetailPage;
