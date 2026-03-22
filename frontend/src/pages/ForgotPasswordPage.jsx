import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { authApi } from '../api/authApi';
import { getErrorMessage } from '../formatters';
import { forgotPasswordSchema } from '../schemas';
import FormInput from '../components/forms/FormInput';

function ForgotPasswordPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { username: '', email: '' },
  });

  const onSubmit = async (values) => {
    try {
      const response = await authApi.forgotPassword(values);
      toast.success(response.message || 'Đã gửi mã đặt lại mật khẩu vào email của bạn');
    } catch (err) {
      toast.error(getErrorMessage(err, 'Không thể gửi mã đặt lại'));
    }
  };

  return (
    <div className="container-shell py-16">
      <div className="mx-auto max-w-lg card-panel p-8">
        <h1 className="text-3xl font-bold text-slate-950">Quên mật khẩu</h1>
        <p className="mt-2 text-sm text-slate-500">Vui lòng nhập đúng tên đăng nhập và email đã gắn với tài khoản.</p>
        <form className="mt-8 space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <FormInput label="Tên đăng nhập" error={errors.username?.message} {...register('username')} />
          <FormInput label="Email" error={errors.email?.message} {...register('email')} />
          <button className="btn-primary w-full" disabled={isSubmitting} type="submit">
            {isSubmitting ? 'Đang gửi...' : 'Gửi mã đặt lại'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ForgotPasswordPage;