import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { reportsApi } from '../api/reportsApi';
import { getErrorMessage } from '../formatters';
import { reportSchema } from '../schemas';
import FormInput from '../components/forms/FormInput';
import FormTextarea from '../components/forms/FormTextarea';

function ReportJobPage() {
  const { id } = useParams();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(reportSchema),
    defaultValues: { title: '', content: '' },
  });

  const onSubmit = async (values) => {
    try {
      const response = await reportsApi.create({ ...values, jobId: id });
      toast.success(response.message || 'Report submitted successfully');
    } catch (err) {
      toast.error(getErrorMessage(err, 'Unable to submit report'));
    }
  };

  return (
    <div className="card-panel max-w-2xl p-6">
      <h1 className="text-2xl font-bold text-slate-950">Report job listing</h1>
      <p className="mt-2 text-sm text-slate-500">Each job seeker can report a job once. Provide enough detail for admin review.</p>
      <form className="mt-6 space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <FormInput label="Report title" error={errors.title?.message} {...register('title')} />
        <FormTextarea label="Report detail" error={errors.content?.message} {...register('content')} />
        <button className="btn-primary w-full" disabled={isSubmitting} type="submit">
          {isSubmitting ? 'Submitting...' : 'Submit report'}
        </button>
      </form>
    </div>
  );
}

export default ReportJobPage;
