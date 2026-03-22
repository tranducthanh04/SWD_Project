import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { authApi } from '../api/authApi';
import { getErrorMessage } from '../formatters';
import { registerSchema } from '../schemas';
import FormInput from '../components/forms/FormInput';
import FormSelect from '../components/forms/FormSelect';

function RegisterPage() {
  const [pendingEmail, setPendingEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: '',
      email: '',
      fullName: '',
      password: '',
      confirmPassword: '',
      gender: 'other',
      role: 'jobseeker',
    },
  });

  const onSubmit = async (values) => {
    try {
      const response = await authApi.register(values);
      setPendingEmail(values.email);
      toast.success(response.message || 'Đăng ký thành công. Vui lòng kiểm tra email để lấy mã OTP.');
    } catch (err) {
      toast.error(getErrorMessage(err, 'Đăng ký thất bại'));
    }
  };

  const handleVerify = async (event) => {
    event.preventDefault();
    try {
      const response = await authApi.verifyEmail({ email: pendingEmail, code: verificationCode });
      toast.success(response.message || 'Xác minh email thành công');
      setVerificationCode('');
    } catch (err) {
      toast.error(getErrorMessage(err, 'Xác minh thất bại'));
    }
  };

  return (
    <div className="container-shell py-16">
      <div className="grid gap-8 lg:grid-cols-[1fr_0.85fr]">
        <div className="card-panel p-8">
          <h1 className="text-3xl font-bold text-slate-950">Tạo tài khoản của bạn</h1>
          <p className="mt-2 text-sm text-slate-500">Chọn vai trò, thiết lập mật khẩu mạnh và xác minh email trước khi đăng nhập.</p>
          <form className="mt-8 grid gap-4 md:grid-cols-2" onSubmit={handleSubmit(onSubmit)}>
            <FormInput label="Tên đăng nhập" error={errors.username?.message} {...register('username')} />
            <FormInput label="Họ và tên" error={errors.fullName?.message} {...register('fullName')} />
            <FormInput label="Email" error={errors.email?.message} {...register('email')} />
            <FormSelect
              label="Vai trò"
              error={errors.role?.message}
              options={[
                { value: 'jobseeker', label: 'Ứng viên' },
                { value: 'enterprise', label: 'Doanh nghiệp' },
              ]}
              {...register('role')}
            />
            <FormSelect
              label="Giới tính"
              error={errors.gender?.message}
              options={[
                { value: 'male', label: 'Nam' },
                { value: 'female', label: 'Nữ' },
                { value: 'other', label: 'Khác' },
              ]}
              {...register('gender')}
            />
            <div className="hidden md:block" />
            <FormInput label="Mật khẩu" type="password" error={errors.password?.message} {...register('password')} />
            <FormInput label="Xác nhận mật khẩu" type="password" error={errors.confirmPassword?.message} {...register('confirmPassword')} />
            <div className="md:col-span-2">
              <button className="btn-primary w-full" disabled={isSubmitting} type="submit">
                {isSubmitting ? 'Đang tạo tài khoản...' : 'Đăng ký'}
              </button>
            </div>
          </form>
        </div>

        <div className="card-panel p-8">
          <h2 className="text-2xl font-semibold text-slate-900">Xác minh email</h2>
          <p className="mt-2 text-sm text-slate-500">Sau khi đăng ký, hãy nhập mã OTP được gửi đến email để kích hoạt tài khoản.</p>
          <form className="mt-8 space-y-4" onSubmit={handleVerify}>
            <FormInput label="Email đã đăng ký" value={pendingEmail} onChange={(event) => setPendingEmail(event.target.value)} />
            <FormInput label="Mã xác minh" value={verificationCode} onChange={(event) => setVerificationCode(event.target.value)} />
            <button className="btn-secondary w-full" type="submit">
              Xác minh email
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;