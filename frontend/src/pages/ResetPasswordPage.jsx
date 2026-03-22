import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { authApi } from '../api/authApi';
import { getErrorMessage } from '../formatters';
import { resetPasswordSchema } from '../schemas';
import FormInput from '../components/forms/FormInput';

function ResetPasswordPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      username: '',
      email: '',
      code: '',
      newPassword: '',
      confirmNewPassword: '',
    },
  });

  const onSubmit = async (values) => {
    try {
      const response = await authApi.resetPassword(values);
      toast.success(response.message || 'Đặt lại mật khẩu thành công');
    } catch (err) {
      toast.error(getErrorMessage(err, 'Không thể đặt lại mật khẩu'));
    }
  };

  return (
    <div className="container-shell py-16">
      <div className="mx-auto max-w-lg card-panel p-8">
        <h1 className="text-3xl font-bold text-slate-950">Đặt lại mật khẩu</h1>
        <p className="mt-2 text-sm text-slate-500">Nhập mã đặt lại được gửi qua email và thiết lập mật khẩu mới.</p>
        <form className="mt-8 space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <FormInput label="Tên đăng nhập" error={errors.username?.message} {...register('username')} />
          <FormInput label="Email" error={errors.email?.message} {...register('email')} />
          <FormInput label="Mã đặt lại" error={errors.code?.message} {...register('code')} />
          <FormInput label="Mật khẩu mới" type="password" error={errors.newPassword?.message} {...register('newPassword')} />
          <FormInput label="Xác nhận mật khẩu mới" type="password" error={errors.confirmNewPassword?.message} {...register('confirmNewPassword')} />
          <button className="btn-primary w-full" disabled={isSubmitting} type="submit">
            {isSubmitting ? 'Đang cập nhật...' : 'Đặt lại mật khẩu'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ResetPasswordPage;