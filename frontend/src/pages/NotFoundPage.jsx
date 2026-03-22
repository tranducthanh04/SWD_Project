import { Link } from 'react-router-dom';

function NotFoundPage() {
  return (
    <div className="container-shell py-24">
      <div className="card-panel mx-auto max-w-2xl p-10 text-center">
        <div className="text-sm font-semibold uppercase tracking-[0.3em] text-brand-700">404</div>
        <h1 className="mt-4 text-4xl font-black text-slate-950">Không tìm thấy trang</h1>
        <p className="mt-4 text-slate-500">Trang bạn yêu cầu không tồn tại hoặc không còn khả dụng.</p>
        <Link to="/" className="btn-primary mt-8">
          Quay về trang chủ
        </Link>
      </div>
    </div>
  );
}

export default NotFoundPage;