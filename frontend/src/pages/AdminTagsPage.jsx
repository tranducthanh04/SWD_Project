import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { tagsApi } from '../api/tagsApi';
import { getErrorMessage } from '../formatters';
import { tagSchema } from '../schemas';
import DataTable from '../components/shared/DataTable';
import LoadingSkeleton from '../components/shared/LoadingSkeleton';
import ErrorState from '../components/shared/ErrorState';
import StatusBadge from '../components/shared/StatusBadge';
import FormInput from '../components/forms/FormInput';

function AdminTagsPage() {
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(tagSchema),
    defaultValues: { name: '', description: '' },
  });

  const loadTags = async () => {
    try {
      const response = await tagsApi.adminList();
      setTags(response.data);
      setError('');
    } catch (err) {
      setError(getErrorMessage(err, 'Không thể tải danh sách thẻ'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTags();
  }, []);

  const onSubmit = async (values) => {
    try {
      await tagsApi.create(values);
      toast.success('Đã tạo thẻ');
      reset();
      loadTags();
    } catch (err) {
      toast.error(getErrorMessage(err, 'Không thể tạo thẻ'));
    }
  };

  const handleEdit = async (tag) => {
    const name = window.prompt('Cập nhật tên thẻ:', tag.name);
    if (!name) return;
    const description = window.prompt('Cập nhật mô tả:', tag.description || '') || '';
    try {
      await tagsApi.update(tag._id, { name, description, isActive: tag.isActive });
      toast.success('Đã cập nhật thẻ');
      loadTags();
    } catch (err) {
      toast.error(getErrorMessage(err, 'Không thể cập nhật thẻ'));
    }
  };

  const handleDelete = async (tag) => {
    if (!window.confirm(`Bạn có chắc muốn xóa thẻ ${tag.name}?`)) return;
    try {
      await tagsApi.remove(tag._id);
      toast.success('Đã xóa thẻ');
      loadTags();
    } catch (err) {
      toast.error(getErrorMessage(err, 'Không thể xóa thẻ'));
    }
  };

  if (loading) return <LoadingSkeleton rows={8} />;
  if (error) return <ErrorState description={error} />;

  return (
    <div className="space-y-6">
      <form className="card-panel grid gap-4 p-6 md:grid-cols-[1fr_1fr_auto]" onSubmit={handleSubmit(onSubmit)}>
        <FormInput label="Tên thẻ" error={errors.name?.message} {...register('name')} />
        <FormInput label="Mô tả" error={errors.description?.message} {...register('description')} />
        <div className="self-end">
          <button className="btn-primary w-full" disabled={isSubmitting} type="submit">
            {isSubmitting ? 'Đang lưu...' : 'Thêm thẻ'}
          </button>
        </div>
      </form>
      <DataTable
        columns={[
          { header: 'Tên thẻ', accessor: 'name' },
          { header: 'Slug', accessor: 'slug' },
          { header: 'Trạng thái', render: (row) => <StatusBadge status={row.isActive ? 'Active' : 'Inactive'} /> },
          {
            header: 'Thao tác',
            render: (row) => (
              <div className="flex gap-2">
                <button className="btn-secondary" onClick={() => handleEdit(row)}>
                  Chỉnh sửa
                </button>
                <button className="btn-primary" onClick={() => handleDelete(row)}>
                  Xóa
                </button>
              </div>
            ),
          },
        ]}
        rows={tags}
      />
    </div>
  );
}

export default AdminTagsPage;