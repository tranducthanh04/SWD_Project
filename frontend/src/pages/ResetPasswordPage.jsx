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
      toast.success(response.message || 'Password reset successfully');
    } catch (err) {
      toast.error(getErrorMessage(err, 'Unable to reset password'));
    }
  };

  return (
    <div className="container-shell py-16">
      <div className="mx-auto max-w-lg card-panel p-8">
        <h1 className="text-3xl font-bold text-slate-950">Reset password</h1>
        <p className="mt-2 text-sm text-slate-500">Enter the reset code from your email and set a new password.</p>
        <form className="mt-8 space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <FormInput label="Username" error={errors.username?.message} {...register('username')} />
          <FormInput label="Email" error={errors.email?.message} {...register('email')} />
          <FormInput label="Reset code" error={errors.code?.message} {...register('code')} />
          <FormInput label="New password" type="password" error={errors.newPassword?.message} {...register('newPassword')} />
          <FormInput label="Confirm password" type="password" error={errors.confirmNewPassword?.message} {...register('confirmNewPassword')} />
          <button className="btn-primary w-full" disabled={isSubmitting} type="submit">
            {isSubmitting ? 'Updating...' : 'Reset password'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ResetPasswordPage;
