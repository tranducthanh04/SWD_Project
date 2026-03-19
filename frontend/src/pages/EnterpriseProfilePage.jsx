import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { profileApi } from '../api/profileApi';
import { getErrorMessage } from '../formatters';
import { enterpriseProfileSchema } from '../schemas';
import FormInput from '../components/forms/FormInput';
import FormTextarea from '../components/forms/FormTextarea';
import FileUploader from '../components/forms/FileUploader';
import StatusBadge from '../components/shared/StatusBadge';
import LoadingSkeleton from '../components/shared/LoadingSkeleton';
import ErrorState from '../components/shared/ErrorState';

function EnterpriseProfilePage({ mode = 'profile' }) {
  const [payload, setPayload] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(enterpriseProfileSchema),
    defaultValues: {
      companyName: '',
      companyEmail: '',
      companyPhone: '',
      companyAddress: '',
      taxCode: '',
      website: '',
      description: '',
    },
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await profileApi.me();
        setPayload(response.data);
        reset({
          companyName: response.data.profile?.companyName || '',
          companyEmail: response.data.profile?.companyEmail || '',
          companyPhone: response.data.profile?.companyPhone || '',
          companyAddress: response.data.profile?.companyAddress || '',
          taxCode: response.data.profile?.taxCode || '',
          website: response.data.profile?.website || '',
          description: response.data.profile?.description || '',
        });
      } catch (err) {
        setError(getErrorMessage(err, 'Unable to load enterprise profile'));
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [reset]);

  const onSubmit = async (values) => {
    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) => {
      if (key !== 'logo') {
        formData.append(key, value);
      }
    });
    if (values.logo?.[0]) formData.append('logo', values.logo[0]);

    try {
      const response = await profileApi.requestEnterpriseUpdate(formData);
      toast.success(response.message || 'Update request submitted');
    } catch (err) {
      toast.error(getErrorMessage(err, 'Unable to submit update request'));
    }
  };

  if (loading) return <LoadingSkeleton rows={8} />;
  if (error) return <ErrorState description={error} />;

  return (
    <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
      <div className="card-panel p-6">
        <h1 className="text-2xl font-bold text-slate-950">Company profile</h1>
        <div className="mt-4 space-y-3 text-sm text-slate-600">
          <div>Company: {payload.profile?.companyName || '-'}</div>
          <div>Verification: <StatusBadge status={payload.profile?.verificationStatus || 'pending'} /></div>
          <div>Plan: {payload.profile?.accountPlan || 'free'}</div>
          {payload.latestRequest ? (
            <div>
              Latest request: <StatusBadge status={payload.latestRequest.status} />
            </div>
          ) : null}
        </div>
      </div>
      <form className="card-panel grid gap-4 p-6 md:grid-cols-2" onSubmit={handleSubmit(onSubmit)}>
        <div className="md:col-span-2 text-sm font-semibold uppercase tracking-[0.2em] text-brand-700">
          {mode === 'request' ? 'Submit update request' : 'Request a profile update'}
        </div>
        <FormInput label="Company name" error={errors.companyName?.message} {...register('companyName')} />
        <FormInput label="Company email" error={errors.companyEmail?.message} {...register('companyEmail')} />
        <FormInput label="Company phone" error={errors.companyPhone?.message} {...register('companyPhone')} />
        <FormInput label="Company address" error={errors.companyAddress?.message} {...register('companyAddress')} />
        <FormInput label="Tax code" error={errors.taxCode?.message} {...register('taxCode')} />
        <FormInput label="Website" error={errors.website?.message} {...register('website')} />
        <div className="md:col-span-2">
          <FormTextarea label="Description" error={errors.description?.message} {...register('description')} />
        </div>
        <div className="md:col-span-2">
          <FileUploader label="Company logo" {...register('logo')} />
        </div>
        <div className="md:col-span-2">
          <button className="btn-primary w-full" disabled={isSubmitting} type="submit">
            {isSubmitting ? 'Submitting...' : 'Submit request'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default EnterpriseProfilePage;


