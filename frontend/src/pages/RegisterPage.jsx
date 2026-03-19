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
      toast.success(response.message || 'Registration submitted. Check your email for the OTP.');
    } catch (err) {
      toast.error(getErrorMessage(err, 'Registration failed'));
    }
  };

  const handleVerify = async (event) => {
    event.preventDefault();
    try {
      const response = await authApi.verifyEmail({ email: pendingEmail, code: verificationCode });
      toast.success(response.message || 'Email verified successfully');
      setVerificationCode('');
    } catch (err) {
      toast.error(getErrorMessage(err, 'Verification failed'));
    }
  };

  return (
    <div className="container-shell py-16">
      <div className="grid gap-8 lg:grid-cols-[1fr_0.85fr]">
        <div className="card-panel p-8">
          <h1 className="text-3xl font-bold text-slate-950">Create your account</h1>
          <p className="mt-2 text-sm text-slate-500">Choose a role, set a strong password, and verify your email before logging in.</p>
          <form className="mt-8 grid gap-4 md:grid-cols-2" onSubmit={handleSubmit(onSubmit)}>
            <FormInput label="Username" error={errors.username?.message} {...register('username')} />
            <FormInput label="Full name" error={errors.fullName?.message} {...register('fullName')} />
            <FormInput label="Email" error={errors.email?.message} {...register('email')} />
            <FormSelect
              label="Role"
              error={errors.role?.message}
              options={[
                { value: 'jobseeker', label: 'Job Seeker' },
                { value: 'enterprise', label: 'Enterprise' },
              ]}
              {...register('role')}
            />
            <FormSelect
              label="Gender"
              error={errors.gender?.message}
              options={[
                { value: 'male', label: 'Male' },
                { value: 'female', label: 'Female' },
                { value: 'other', label: 'Other' },
              ]}
              {...register('gender')}
            />
            <div className="hidden md:block" />
            <FormInput label="Password" type="password" error={errors.password?.message} {...register('password')} />
            <FormInput label="Confirm password" type="password" error={errors.confirmPassword?.message} {...register('confirmPassword')} />
            <div className="md:col-span-2">
              <button className="btn-primary w-full" disabled={isSubmitting} type="submit">
                {isSubmitting ? 'Creating account...' : 'Register'}
              </button>
            </div>
          </form>
        </div>

        <div className="card-panel p-8">
          <h2 className="text-2xl font-semibold text-slate-900">Verify your email</h2>
          <p className="mt-2 text-sm text-slate-500">After registration, paste the OTP from your email here to activate the account.</p>
          <form className="mt-8 space-y-4" onSubmit={handleVerify}>
            <FormInput label="Registered email" value={pendingEmail} onChange={(event) => setPendingEmail(event.target.value)} />
            <FormInput label="Verification code" value={verificationCode} onChange={(event) => setVerificationCode(event.target.value)} />
            <button className="btn-secondary w-full" type="submit">
              Verify email
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
