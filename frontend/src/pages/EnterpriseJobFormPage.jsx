import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { jobsApi } from '../api/jobsApi';
import { tagsApi } from '../api/tagsApi';
import { experienceLevels, jobTypes } from '../constants';
import { displayExperienceLevel, displayJobType, getErrorMessage } from '../formatters';
import { jobSchema } from '../schemas';
import FormInput from '../components/forms/FormInput';
import FormSelect from '../components/forms/FormSelect';
import FormTextarea from '../components/forms/FormTextarea';
import LoadingSkeleton from '../components/shared/LoadingSkeleton';
import ErrorState from '../components/shared/ErrorState';

function EnterpriseJobFormPage() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(Boolean(jobId));
  const [error, setError] = useState('');
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(jobSchema),
    defaultValues: {
      title: '',
      overview: '',
      description: '',
      requirements: '',
      benefits: '',
      location: '',
      salaryMin: 0,
      salaryMax: 0,
      currency: 'USD',
      experienceLevel: '',
      jobType: '',
      tags: '',
      applicationDeadline: '',
    },
  });

  const jobTypeOptions = jobTypes.map((item) => ({ value: item, label: displayJobType(item) }));
  const experienceLevelOptions = experienceLevels.map((item) => ({ value: item, label: displayExperienceLevel(item) }));

  useEffect(() => {
    const fetchData = async () => {
      try {
        const tagResponse = await tagsApi.list();
        setTags(tagResponse.data || []);
        if (jobId) {
          const response = await jobsApi.detail(jobId);
          reset({
            title: response.data.title,
            overview: response.data.overview,
            description: response.data.description,
            requirements: (response.data.requirements || []).join(', '),
            benefits: (response.data.benefits || []).join(', '),
            location: response.data.location,
            salaryMin: response.data.salaryMin,
            salaryMax: response.data.salaryMax,
            currency: response.data.currency,
            experienceLevel: response.data.experienceLevel,
            jobType: response.data.jobType,
            tags: (response.data.tags || []).map((tag) => tag.slug).join(', '),
            applicationDeadline: response.data.applicationDeadline?.slice(0, 10),
          });
        }
      } catch (err) {
        setError(getErrorMessage(err, 'Không thể tải dữ liệu biểu mẫu tuyển dụng'));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [jobId, reset]);

  const onSubmit = async (values) => {
    try {
      const response = jobId ? await jobsApi.update(jobId, values) : await jobsApi.create(values);
      toast.success(response.message || 'Đã lưu tin tuyển dụng thành công');
      navigate('/enterprise/jobs');
    } catch (err) {
      toast.error(getErrorMessage(err, 'Không thể lưu việc làm'));
    }
  };

  if (loading) return <LoadingSkeleton rows={8} />;
  if (error) return <ErrorState description={error} />;

  return (
    <form className="card-panel grid gap-4 p-6 md:grid-cols-2" onSubmit={handleSubmit(onSubmit)}>
      <div className="md:col-span-2 text-2xl font-bold text-slate-950">{jobId ? 'Cập nhật tin tuyển dụng' : 'Tạo tin tuyển dụng mới'}</div>
      <FormInput label="Tiêu đề" error={errors.title?.message} {...register('title')} />
      <FormInput label="Địa điểm" error={errors.location?.message} {...register('location')} />
      <div className="md:col-span-2">
        <FormTextarea label="Tổng quan" error={errors.overview?.message} {...register('overview')} />
      </div>
      <div className="md:col-span-2">
        <FormTextarea label="Mô tả" error={errors.description?.message} {...register('description')} />
      </div>
      <FormInput label="Yêu cầu (cách nhau bằng dấu phẩy)" error={errors.requirements?.message} {...register('requirements')} />
      <FormInput label="Quyền lợi (cách nhau bằng dấu phẩy)" error={errors.benefits?.message} {...register('benefits')} />
      <FormInput label="Lương tối thiểu" type="number" error={errors.salaryMin?.message} {...register('salaryMin')} />
      <FormInput label="Lương tối đa" type="number" error={errors.salaryMax?.message} {...register('salaryMax')} />
      <FormInput label="Tiền tệ" error={errors.currency?.message} {...register('currency')} />
      <FormInput label="Hạn nộp hồ sơ" type="date" error={errors.applicationDeadline?.message} {...register('applicationDeadline')} />
      <FormSelect label="Cấp độ kinh nghiệm" error={errors.experienceLevel?.message} options={experienceLevelOptions} {...register('experienceLevel')} />
      <FormSelect label="Hình thức làm việc" error={errors.jobType?.message} options={jobTypeOptions} {...register('jobType')} />
      <div className="md:col-span-2">
        <FormInput label={`Thẻ (nhập slug, cách nhau bằng dấu phẩy: ${tags.map((tag) => tag.slug).slice(0, 6).join(', ')})`} error={errors.tags?.message} {...register('tags')} />
      </div>
      <div className="md:col-span-2">
        <button className="btn-primary w-full" disabled={isSubmitting} type="submit">
          {isSubmitting ? 'Đang lưu...' : jobId ? 'Cập nhật tin tuyển dụng' : 'Tạo tin tuyển dụng'}
        </button>
      </div>
    </form>
  );
}

export default EnterpriseJobFormPage;