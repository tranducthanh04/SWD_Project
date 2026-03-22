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
        setError(getErrorMessage(err, 'Không thể tải hồ sơ'));
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
      toast.success(response.message || 'Cập nhật hồ sơ thành công');
    } catch (err) {
      toast.error(getErrorMessage(err, 'Không thể cập nhật hồ sơ'));
    }
  };

  if (loading) return <LoadingSkeleton rows={8} />;
  if (error) return <ErrorState description={error} />;

  return (
    <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
      <div className="card-panel p-6">
        <h1 className="text-2xl font-bold text-slate-950">Hồ sơ của tôi</h1>
        <div className="mt-4 space-y-3 text-sm text-slate-600">
          <div>Họ và tên: {profileResponse?.user?.fullName}</div>
          <div>Email: {profileResponse?.user?.email}</div>
          <div>Trạng thái hồ sơ: {profileResponse?.profile?.profileCompleted ? 'Đã hoàn thiện' : 'Chưa hoàn thiện'}</div>
          <div>Kỹ năng: {(profileResponse?.profile?.skills || []).join(', ') || '-'}</div>
        </div>
      </div>
      <form className="card-panel grid gap-4 p-6 md:grid-cols-2" onSubmit={handleSubmit(onSubmit)}>
        <FormInput label="Họ và tên" error={errors.fullName?.message} {...register('fullName')} />
        <FormInput label="Số điện thoại" error={errors.phone?.message} {...register('phone')} />
        <FormInput label="Địa chỉ" error={errors.address?.message} {...register('address')} />
        <FormInput label="Ngày sinh" type="date" error={errors.dateOfBirth?.message} {...register('dateOfBirth')} />
        <FormInput label="Số năm kinh nghiệm" type="number" error={errors.experienceYears?.message} {...register('experienceYears')} />
        <FormInput label="Học vấn" error={errors.education?.message} {...register('education')} />
        <div className="md:col-span-2">
          <FormTextarea label="Tóm tắt chuyên môn" error={errors.summary?.message} {...register('summary')} />
        </div>
        <FormInput label="Kỹ năng (cách nhau bằng dấu phẩy)" error={errors.skills?.message} {...register('skills')} />
        <FormInput label="Thẻ yêu thích (cách nhau bằng dấu phẩy)" error={errors.favouriteTags?.message} {...register('favouriteTags')} />
        <FileUploader label="Ảnh đại diện" {...register('avatar')} />
        <FileUploader label="CV" {...register('cvFile')} />
        <div className="md:col-span-2">
          <button className="btn-primary w-full" disabled={isSubmitting} type="submit">
            {isSubmitting ? 'Đang lưu...' : 'Cập nhật hồ sơ'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default ProfilePage;