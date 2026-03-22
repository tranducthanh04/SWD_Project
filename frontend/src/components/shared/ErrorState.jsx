function ErrorState({ title = 'Đã xảy ra lỗi', description = 'Không thể tải dữ liệu. Vui lòng thử lại sau.' }) {
  return (
    <div className="card-panel border-red-100 bg-red-50/80 p-8 text-center">
      <h3 className="text-xl font-semibold text-red-700">{title}</h3>
      <p className="mt-2 text-sm text-red-600">{description}</p>
    </div>
  );
}

export default ErrorState;