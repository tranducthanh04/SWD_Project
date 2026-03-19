import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { profileApi } from '../api/profileApi';
import { getErrorMessage } from '../formatters';
import { profileSchema } from '../schemas';
import FormInput from '../components/forms/FormInput';
import FormTextarea from '../components/forms/FormTextarea';
import FileUploader from '../components/forms/FileUploader';
import LoadingSkeleton from '../components/shared/LoadingSkeleton';
import ErrorState from '../components/shared/ErrorState';

function ProfilePage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [profileResponse, setProfileResponse] = useState(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: '',
      phone: '',
      address: '',
      dateOfBirth: '',
      experienceYears: 0,
      education: '',
      summary: '',
      skills: '',
      favouriteTags: '',
    },
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await profileApi.me();
        setProfileResponse(response.data);
        reset({
          fullName: response.data.user?.fullName || '',
          phone: response.data.user?.phone || '',
          address: response.data.user?.address || '',
          dateOfBirth: response.data.profile?.dateOfBirth?.slice(0, 10) || '',
          experienceYears: response.data.profile?.experienceYears || 0,
          education: response.data.profile?.education || '',
          summary: response.data.profile?.summary || '',
          skills: (response.data.profile?.skills || []).join(', '),
          favouriteTags: (response.data.profile?.favouriteTags || []).join(', '),
        });
      } catch (err) {
        setError(getErrorMessage(err, 'Unable to load profile'));
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [reset]);

  const onSubmit = async (values) => {
    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) => {
      if (key !== 'avatar' && key !== 'cvFile') {
        formData.append(key, value);
      }
    });
    if (values.avatar?.[0]) formData.append('avatar', values.avatar[0]);
    if (values.cvFile?.[0]) formData.append('cvFile', values.cvFile[0]);

    try {
      const response = await profileApi.updateJobSeeker(formData);
      setProfileResponse(response.data);
      toast.success(response.message || 'Profile updated successfully');
    } catch (err) {
      toast.error(getErrorMessage(err, 'Unable to update profile'));
    }
  };

  if (loading) return <LoadingSkeleton rows={8} />;
  if (error) return <ErrorState description={error} />;

  return (
    <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
      <div className="card-panel p-6">
        <h1 className="text-2xl font-bold text-slate-950">My profile</h1>
        <div className="mt-4 space-y-3 text-sm text-slate-600">
          <div>Name: {profileResponse?.user?.fullName}</div>
          <div>Email: {profileResponse?.user?.email}</div>
          <div>Status: {profileResponse?.profile?.profileCompleted ? 'Completed' : 'Incomplete'}</div>
          <div>Skills: {(profileResponse?.profile?.skills || []).join(', ') || '-'}</div>
        </div>
      </div>
      <form className="card-panel grid gap-4 p-6 md:grid-cols-2" onSubmit={handleSubmit(onSubmit)}>
        <FormInput label="Full name" error={errors.fullName?.message} {...register('fullName')} />
        <FormInput label="Phone" error={errors.phone?.message} {...register('phone')} />
        <FormInput label="Address" error={errors.address?.message} {...register('address')} />
        <FormInput label="Date of birth" type="date" error={errors.dateOfBirth?.message} {...register('dateOfBirth')} />
        <FormInput label="Experience years" type="number" error={errors.experienceYears?.message} {...register('experienceYears')} />
        <FormInput label="Education" error={errors.education?.message} {...register('education')} />
        <div className="md:col-span-2">
          <FormTextarea label="Professional summary" error={errors.summary?.message} {...register('summary')} />
        </div>
        <FormInput label="Skills (comma separated)" error={errors.skills?.message} {...register('skills')} />
        <FormInput label="Favourite tags (comma separated)" error={errors.favouriteTags?.message} {...register('favouriteTags')} />
        <FileUploader label="Avatar" {...register('avatar')} />
        <FileUploader label="CV" {...register('cvFile')} />
        <div className="md:col-span-2">
          <button className="btn-primary w-full" disabled={isSubmitting} type="submit">
            {isSubmitting ? 'Saving...' : 'Update profile'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default ProfilePage;


