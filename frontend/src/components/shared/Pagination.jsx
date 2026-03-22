function Pagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null;

  return (
    <div className="mt-8 flex items-center justify-center gap-3">
      <button className="btn-secondary" disabled={page <= 1} onClick={() => onChange(page - 1)}>
        Trước
      </button>
      <span className="text-sm text-slate-500">
        Trang {page} / {totalPages}
      </span>
      <button className="btn-secondary" disabled={page >= totalPages} onClick={() => onChange(page + 1)}>
        Sau
      </button>
    </div>
  );
}

export default Pagination;