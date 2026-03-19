import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { jobsApi } from '../api/jobsApi';
import { tagsApi } from '../api/tagsApi';
import { experienceLevels, jobTypes } from '../constants';
import { getErrorMessage } from '../formatters';
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
        setError(getErrorMessage(err, 'Unable to load job form data'));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [jobId, reset]);

  const onSubmit = async (values) => {
    try {
      const response = jobId ? await jobsApi.update(jobId, values) : await jobsApi.create(values);
      toast.success(response.message || 'Job saved successfully');
      navigate('/enterprise/jobs');
    } catch (err) {
      toast.error(getErrorMessage(err, 'Unable to save job'));
    }
  };

  if (loading) return <LoadingSkeleton rows={8} />;
  if (error) return <ErrorState description={error} />;

  return (
    <form className="card-panel grid gap-4 p-6 md:grid-cols-2" onSubmit={handleSubmit(onSubmit)}>
      <div className="md:col-span-2 text-2xl font-bold text-slate-950">{jobId ? 'Update job' : 'Create a new job'}</div>
      <FormInput label="Title" error={errors.title?.message} {...register('title')} />
      <FormInput label="Location" error={errors.location?.message} {...register('location')} />
      <div className="md:col-span-2">
        <FormTextarea label="Overview" error={errors.overview?.message} {...register('overview')} />
      </div>
      <div className="md:col-span-2">
        <FormTextarea label="Description" error={errors.description?.message} {...register('description')} />
      </div>
      <FormInput label="Requirements (comma separated)" error={errors.requirements?.message} {...register('requirements')} />
      <FormInput label="Benefits (comma separated)" error={errors.benefits?.message} {...register('benefits')} />
      <FormInput label="Salary min" type="number" error={errors.salaryMin?.message} {...register('salaryMin')} />
      <FormInput label="Salary max" type="number" error={errors.salaryMax?.message} {...register('salaryMax')} />
      <FormInput label="Currency" error={errors.currency?.message} {...register('currency')} />
      <FormInput label="Application deadline" type="date" error={errors.applicationDeadline?.message} {...register('applicationDeadline')} />
      <FormSelect label="Experience level" error={errors.experienceLevel?.message} options={experienceLevels} {...register('experienceLevel')} />
      <FormSelect label="Job type" error={errors.jobType?.message} options={jobTypes} {...register('jobType')} />
      <div className="md:col-span-2">
        <FormInput label={`Tags (comma separated slugs: ${tags.map((tag) => tag.slug).slice(0, 6).join(', ')})`} error={errors.tags?.message} {...register('tags')} />
      </div>
      <div className="md:col-span-2">
        <button className="btn-primary w-full" disabled={isSubmitting} type="submit">
          {isSubmitting ? 'Saving...' : jobId ? 'Update job' : 'Create job'}
        </button>
      </div>
    </form>
  );
}

export default EnterpriseJobFormPage;
