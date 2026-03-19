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
    defaultValues: { identifier: '', password: '' },
  });

  const onSubmit = async (values) => {
    try {
      const response = await login(values);
      toast.success(response.message || 'Login successful');
      navigate(location.state?.from?.pathname || getDashboardPath(response.data.user.role));
    } catch (err) {
      toast.error(getErrorMessage(err, 'Login failed'));
    }
  };

  return (
    <div className="container-shell py-16">
      <div className="mx-auto max-w-lg card-panel p-8">
        <h1 className="text-3xl font-bold text-slate-950">Welcome back</h1>
        <p className="mt-2 text-sm text-slate-500">Sign in with your username or email and password.</p>
        <form className="mt-8 space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <FormInput label="Username or email" error={errors.identifier?.message} {...register('identifier')} />
          <FormInput label="Password" type="password" error={errors.password?.message} {...register('password')} />
          <button className="btn-primary w-full" disabled={isSubmitting} type="submit">
            {isSubmitting ? 'Signing in...' : 'Login'}
          </button>
        </form>
        <div className="mt-6 flex items-center justify-between text-sm text-slate-500">
          <Link to="/forgot-password" className="text-brand-700 hover:underline">
            Forgot password?
          </Link>
          <Link to="/register" className="text-brand-700 hover:underline">
            Create account
          </Link>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
