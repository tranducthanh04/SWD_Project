import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { adminApi } from '../api/adminApi';
import DataTable from '../components/shared/DataTable';
import LoadingSkeleton from '../components/shared/LoadingSkeleton';
import ErrorState from '../components/shared/ErrorState';
import StatusBadge from '../components/shared/StatusBadge';
import { getErrorMessage } from '../formatters';

function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadUsers = async () => {
    try {
      const response = await adminApi.users();
      setUsers(response.data);
      setError('');
    } catch (err) {
      setError(getErrorMessage(err, 'Unable to load users'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleAction = async (handler, successMessage) => {
    try {
      await handler();
      toast.success(successMessage);
      loadUsers();
    } catch (err) {
      toast.error(getErrorMessage(err, 'Action failed'));
    }
  };

  if (loading) return <LoadingSkeleton rows={8} />;
  if (error) return <ErrorState description={error} />;

  return (
    <DataTable
      columns={[
        { header: 'User', render: (row) => <Link className="font-semibold text-brand-700" to={`/admin/users/${row._id}`}>{row.fullName}</Link> },
        { header: 'Email', accessor: 'email' },
        { header: 'Role', accessor: 'role' },
        { header: 'Verified', render: (row) => <StatusBadge status={row.isEmailVerified ? 'Verified' : 'Unverified'} /> },
        { header: 'Status', render: (row) => <StatusBadge status={row.isBanned ? 'Banned' : row.isActive ? 'Active' : 'Inactive'} /> },
        {
          header: 'Actions',
          render: (row) => (
            <div className="flex flex-wrap gap-2">
              {row.isBanned ? (
                <button className="btn-secondary" onClick={() => handleAction(() => adminApi.unbanUser(row._id), 'User unbanned')}>
                  Unban
                </button>
              ) : (
                <button className="btn-secondary" onClick={() => handleAction(() => adminApi.banUser(row._id), 'User banned')}>
                  Ban
                </button>
              )}
              <button className="btn-primary" onClick={() => handleAction(() => adminApi.deleteUser(row._id), 'User deactivated')}>
                Deactivate
              </button>
            </div>
          ),
        },
      ]}
      rows={users}
    />
  );
}

export default AdminUsersPage;
