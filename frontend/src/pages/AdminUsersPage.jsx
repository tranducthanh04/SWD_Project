import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { adminApi } from '../api/adminApi';
import DataTable from '../components/shared/DataTable';
import LoadingSkeleton from '../components/shared/LoadingSkeleton';
import ErrorState from '../components/shared/ErrorState';
import StatusBadge from '../components/shared/StatusBadge';
import { displayRole, getErrorMessage } from '../formatters';

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
      setError(getErrorMessage(err, 'Không thể tải danh sách người dùng'));
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
      toast.error(getErrorMessage(err, 'Thao tác thất bại'));
    }
  };

  if (loading) return <LoadingSkeleton rows={8} />;
  if (error) return <ErrorState description={error} />;

  return (
    <DataTable
      columns={[
        { header: 'Người dùng', render: (row) => <Link className="font-semibold text-brand-700" to={`/admin/users/${row._id}`}>{row.fullName}</Link> },
        { header: 'Email', accessor: 'email' },
        { header: 'Vai trò', render: (row) => displayRole(row.role) },
        { header: 'Đã xác minh', render: (row) => <StatusBadge status={row.isEmailVerified ? 'Verified' : 'Unverified'} /> },
        { header: 'Trạng thái', render: (row) => <StatusBadge status={row.isBanned ? 'Banned' : row.isActive ? 'Active' : 'Inactive'} /> },
        {
          header: 'Thao tác',
          render: (row) => (
            <div className="flex flex-wrap gap-2">
              {row.isBanned ? (
                <button className="btn-secondary" onClick={() => handleAction(() => adminApi.unbanUser(row._id), 'Đã mở khóa người dùng')}>
                  Mở khóa
                </button>
              ) : (
                <button className="btn-secondary" onClick={() => handleAction(() => adminApi.banUser(row._id), 'Đã khóa người dùng')}>
                  Khóa
                </button>
              )}
              <button className="btn-primary" onClick={() => handleAction(() => adminApi.deleteUser(row._id), 'Đã ngừng hoạt động người dùng')}>
                Ngừng hoạt động
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