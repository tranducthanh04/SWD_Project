import { Link, useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { jobsApi } from '../api/jobsApi';
import { applicationsApi } from '../api/applicationsApi';
import { savedJobsApi } from '../api/savedJobsApi';
import { useAuth } from '../contexts/AuthContext';
import { currency, dateDisplay, displayExperienceLevel, displayJobType, getErrorMessage } from '../formatters';
import StatusBadge from '../components/shared/StatusBadge';
import LoadingSkeleton from '../components/shared/LoadingSkeleton';
import ErrorState from '../components/shared/ErrorState';
import FormTextarea from '../components/forms/FormTextarea';
import FileUploader from '../components/forms/FileUploader';

function JobDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [coverLetter, setCoverLetter] = useState('');
  const [cvFile, setCvFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const response = await jobsApi.detail(id);
        setJob(response.data);
      } catch (err) {
        setError(getErrorMessage(err, 'Không thể tải chi tiết việc làm'));
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id]);

  const handleSaveJob = async () => {
    try {
      await savedJobsApi.save(id);
      toast.success('Đã lưu việc làm thành công');
    } catch (err) {
      toast.error(getErrorMessage(err, 'Không thể lưu việc làm'));
    }
  };

  const handleApply = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      if (coverLetter) formData.append('coverLetter', coverLetter);
      if (cvFile) formData.append('cvFile', cvFile);
      await applicationsApi.apply(id, formData);
      toast.success('Đã gửi đơn ứng tuyển');
      setCoverLetter('');
      setCvFile(null);
    } catch (err) {
      toast.error(getErrorMessage(err, 'Không thể gửi đơn ứng tuyển'));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="container-shell py-12">
        <LoadingSkeleton rows={8} />
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="container-shell py-12">
        <ErrorState description={error || 'Không tìm thấy việc làm'} />
      </div>
    );
  }

  return (
    <div className="container-shell py-12">
      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-6">
          <div className="card-panel p-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-700">{job.company?.companyName || 'Doanh nghiệp'}</p>
                <h1 className="mt-2 text-4xl font-black text-slate-950">{job.title}</h1>
                <div className="mt-4 flex flex-wrap gap-3 text-sm text-slate-500">
                  <span>{job.location}</span>
                  <span>{currency(job.salaryMin, job.salaryMax, job.currency)}</span>
                  <span>{displayJobType(job.jobType)}</span>
                  <span>{displayExperienceLevel(job.experienceLevel)}</span>
                </div>
              </div>
              <StatusBadge status={job.status} />
            </div>
            <p className="mt-6 text-base leading-7 text-slate-600">{job.description}</p>
          </div>

          <div className="card-panel p-8">
            <h2 className="text-2xl font-semibold text-slate-900">Yêu cầu tuyển dụng</h2>
            <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-slate-600">
              {(job.requirements || []).map((item, index) => (
                <li key={`${item}-${index}`}>{item}</li>
              ))}
            </ul>
          </div>

          <div className="card-panel p-8">
            <h2 className="text-2xl font-semibold text-slate-900">Quyền lợi</h2>
            <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-slate-600">
              {(job.benefits || []).map((item, index) => (
                <li key={`${item}-${index}`}>{item}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="space-y-6">
          <div className="card-panel p-6">
            <h2 className="text-xl font-semibold text-slate-900">Tóm tắt ứng tuyển</h2>
            <div className="mt-4 space-y-3 text-sm text-slate-600">
              <div>Hạn nộp hồ sơ: {dateDisplay(job.applicationDeadline)}</div>
              <div>Số lượng ứng viên: {job.applicantCount}</div>
              <div>Lượt xem: {job.viewCount}</div>
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              {(job.tags || []).map((tag) => (
                <span key={tag._id} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                  {tag.name}
                </span>
              ))}
            </div>
            {user?.role === 'jobseeker' ? (
              <div className="mt-6 flex gap-3">
                <button className="btn-secondary flex-1" onClick={handleSaveJob}>
                  Lưu việc làm
                </button>
                <button className="btn-secondary flex-1" onClick={() => navigate(`/jobs/${id}/report`)}>
                  Báo cáo tin
                </button>
              </div>
            ) : null}
          </div>

          {user?.role === 'jobseeker' ? (
            <form className="card-panel space-y-4 p-6" onSubmit={handleApply}>
              <h2 className="text-xl font-semibold text-slate-900">Ứng tuyển ngay</h2>
              <FormTextarea label="Thư giới thiệu" value={coverLetter} onChange={(event) => setCoverLetter(event.target.value)} />
              <FileUploader label="Tải CV lên (không bắt buộc nếu hồ sơ đã có CV)" onChange={(event) => setCvFile(event.target.files?.[0] || null)} />
              <button className="btn-primary w-full" disabled={isSubmitting} type="submit">
                {isSubmitting ? 'Đang gửi...' : 'Gửi đơn ứng tuyển'}
              </button>
            </form>
          ) : null}

          {!user ? (
            <div className="card-panel p-6 text-sm text-slate-600">
              <p>Đăng nhập với vai trò ứng viên để lưu việc làm, ứng tuyển bằng CV hoặc báo cáo tin tuyển dụng đáng ngờ.</p>
              <Link to="/login" className="btn-primary mt-4 w-full">
                Đăng nhập để tiếp tục
              </Link>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default JobDetailPage;