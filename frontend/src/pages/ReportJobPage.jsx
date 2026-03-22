import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { reportsApi } from '../api/reportsApi';
import { getErrorMessage } from '../formatters';
import { reportSchema } from '../schemas';
import FormInput from '../components/forms/FormInput';
import FormTextarea from '../components/forms/FormTextarea';

function ReportJobPage() {
  const { id } = useParams();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(reportSchema),
    defaultValues: { title: '', content: '' },
  });

  const onSubmit = async (values) => {
    try {
      const response = await reportsApi.create({ ...values, jobId: id });
      toast.success(response.message || 'Đã gửi báo cáo thành công');
    } catch (err) {
      toast.error(getErrorMessage(err, 'Không thể gửi báo cáo'));
    }
  };

  return (
    <div className="card-panel max-w-2xl p-6">
      <h1 className="text-2xl font-bold text-slate-950">Báo cáo tin tuyển dụng</h1>
      <p className="mt-2 text-sm text-slate-500">Mỗi ứng viên chỉ có thể báo cáo một tin một lần. Vui lòng cung cấp đủ thông tin để quản trị viên xem xét.</p>
      <form className="mt-6 space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <FormInput label="Tiêu đề báo cáo" error={errors.title?.message} {...register('title')} />
        <FormTextarea label="Nội dung báo cáo" error={errors.content?.message} {...register('content')} />
        <button className="btn-primary w-full" disabled={isSubmitting} type="submit">
          {isSubmitting ? 'Đang gửi...' : 'Gửi báo cáo'}
        </button>
      </form>
    </div>
  );
}

export default ReportJobPage;