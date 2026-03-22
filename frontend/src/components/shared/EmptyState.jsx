function EmptyState({ title = 'Không có dữ liệu', description = 'Hiện chưa có thông tin để hiển thị.' }) {
  return (
    <div className="card-panel p-8 text-center">
      <h3 className="text-xl font-semibold text-slate-900">{title}</h3>
      <p className="mt-2 text-sm text-slate-500">{description}</p>
    </div>
  );
}

export default EmptyState;