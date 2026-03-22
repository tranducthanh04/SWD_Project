import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../contexts/AuthContext';
import { getDashboardPath } from '../constants';
import { getErrorMessage } from '../formatters';
import { loginSchema } from '../schemas';
import FormInput from '../components/forms/FormInput';

function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { identifier: location.state?.prefillUsername || '', password: '' },
  });

  const onSubmit = async (values) => {
    try {
      const response = await login(values);
      toast.success(response.message || 'Đăng nhập thành công');
      navigate(location.state?.from?.pathname || getDashboardPath(response.data.user.role));
    } catch (err) {
      toast.error(getErrorMessage(err, 'Đăng nhập thất bại'));
    }
  };

  return (
    <div className="container-shell py-16">
      <div className="mx-auto max-w-lg card-panel p-8">
        <h1 className="text-3xl font-bold text-slate-950">Chào mừng bạn quay lại</h1>
        <p className="mt-2 text-sm text-slate-500">Đăng nhập bằng tên đăng nhập hoặc email cùng mật khẩu của bạn.</p>
        <form className="mt-8 space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <FormInput label="Tên đăng nhập hoặc email" error={errors.identifier?.message} {...register('identifier')} />
          <FormInput label="Mật khẩu" type="password" error={errors.password?.message} {...register('password')} />
          <button className="btn-primary w-full" disabled={isSubmitting} type="submit">
            {isSubmitting ? 'Đang đăng nhập...' : 'Đăng nhập'}
          </button>
        </form>
        <div className="mt-6 flex items-center justify-between text-sm text-slate-500">
          <Link to="/forgot-password" className="text-brand-700 hover:underline">
            Quên mật khẩu?
          </Link>
          <Link to="/register" className="text-brand-700 hover:underline">
            Tạo tài khoản
          </Link>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;