import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { authApi } from '../api/authApi';
import { getErrorMessage } from '../formatters';
import { forgotPasswordSchema, resetPasswordSchema } from '../schemas';
import FormInput from '../components/forms/FormInput';

// Bước 2: nhập OTP
function StepOtp({ email, onSuccess }) {
  const [code, setCode] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (code.trim()) onSuccess(code.trim());
  };

  return (
    <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
      <p className="text-sm text-slate-500">
        Mã xác nhận đã được gửi tới <span className="font-medium text-slate-700">{email}</span>. Vui lòng kiểm tra hộp thư.
      </p>
      <FormInput
        label="Mã OTP"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="Nhập mã 6 chữ số"
      />
      <button className="btn-primary w-full" type="submit" disabled={!code.trim()}>
        Xác nhận mã OTP
      </button>
    </form>
  );
}

// Bước 3: đặt mật khẩu mới
function StepNewPassword({ username, email, code, onSuccess }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { username, email, code, newPassword: '', confirmNewPassword: '' },
  });

  const onSubmit = async (values) => {
    try {
      const response = await authApi.resetPassword({ ...values, username, email, code });
      toast.success(response.message || 'Đặt lại mật khẩu thành công!');
      onSuccess();
    } catch (err) {
      toast.error(getErrorMessage(err, 'Không thể đặt lại mật khẩu'));
    }
  };

  return (
    <form className="mt-8 space-y-4" onSubmit={handleSubmit(onSubmit)}>
      <FormInput
        label="Mật khẩu mới"
        type="password"
        error={errors.newPassword?.message}
        {...register('newPassword')}
      />
      <FormInput
        label="Xác nhận mật khẩu mới"
        type="password"
        error={errors.confirmNewPassword?.message}
        {...register('confirmNewPassword')}
      />
      <button className="btn-primary w-full" disabled={isSubmitting} type="submit">
        {isSubmitting ? 'Đang cập nhật...' : 'Đặt lại mật khẩu'}
      </button>
    </form>
  );
}

const STEP_LABELS = ['Thông tin tài khoản', 'Xác nhận OTP', 'Mật khẩu mới'];

function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [savedUsername, setSavedUsername] = useState('');
  const [savedEmail, setSavedEmail] = useState('');
  const [savedCode, setSavedCode] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { username: '', email: '' },
  });

  const onSubmitEmail = async (values) => {
    try {
      const response = await authApi.forgotPassword(values);
      setSavedUsername(values.username);
      setSavedEmail(values.email);
      toast.success(response.message || 'Đã gửi mã OTP vào email của bạn');
      setStep(2);
    } catch (err) {
      toast.error(getErrorMessage(err, 'Không thể gửi mã đặt lại'));
    }
  };

  const onOtpSuccess = (code) => {
    setSavedCode(code);
    setStep(3);
  };

  const onResetSuccess = () => {
    navigate('/login');
  };

  return (
    <div className="container-shell py-16">
      <div className="mx-auto max-w-lg card-panel p-8">
        {/* Stepper */}
        <div className="flex items-center mb-8">
          {STEP_LABELS.map((label, idx) => {
            const num = idx + 1;
            const active = num === step;
            const done = num < step;
            return (
              <div key={label} className="flex items-center flex-1 last:flex-none">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-colors ${
                      done
                        ? 'bg-green-500 border-green-500 text-white'
                        : active
                        ? 'bg-brand-700 border-brand-700 text-white'
                        : 'border-slate-300 text-slate-400'
                    }`}
                  >
                    {done ? '✓' : num}
                  </div>
                  <span className={`mt-1 text-xs hidden sm:block ${active ? 'text-brand-700 font-semibold' : 'text-slate-400'}`}>
                    {label}
                  </span>
                </div>
                {idx < STEP_LABELS.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-2 mb-4 ${done ? 'bg-green-400' : 'bg-slate-200'}`} />
                )}
              </div>
            );
          })}
        </div>

        <h1 className="text-3xl font-bold text-slate-950">Quên mật khẩu</h1>

        {step === 1 && (
          <>
            <p className="mt-2 text-sm text-slate-500">Nhập tên đăng nhập và email đã gắn với tài khoản để nhận mã OTP.</p>
            <form className="mt-8 space-y-4" onSubmit={handleSubmit(onSubmitEmail)}>
              <FormInput label="Tên đăng nhập" error={errors.username?.message} {...register('username')} />
              <FormInput label="Email" error={errors.email?.message} {...register('email')} />
              <button className="btn-primary w-full" disabled={isSubmitting} type="submit">
                {isSubmitting ? 'Đang gửi...' : 'Gửi mã OTP'}
              </button>
            </form>
          </>
        )}

        {step === 2 && (
          <>
            <p className="mt-2 text-sm text-slate-500">Nhập mã OTP được gửi về email của bạn.</p>
            <StepOtp email={savedEmail} onSuccess={onOtpSuccess} />
          </>
        )}

        {step === 3 && (
          <>
            <p className="mt-2 text-sm text-slate-500">Thiết lập mật khẩu mới cho tài khoản của bạn.</p>
            <StepNewPassword
              username={savedUsername}
              email={savedEmail}
              code={savedCode}
              onSuccess={onResetSuccess}
            />
          </>
        )}
      </div>
    </div>
  );
}

export default ForgotPasswordPage;