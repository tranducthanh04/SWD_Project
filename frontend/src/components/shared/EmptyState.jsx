function EmptyState({ title, description, action }) {
  return (
    <div className="card-panel flex flex-col items-center justify-center gap-3 p-10 text-center">
      <div className="rounded-full bg-brand-50 px-4 py-2 text-sm font-semibold text-brand-700">No data</div>
      <h3 className="text-xl font-semibold text-slate-900">{title}</h3>
      <p className="max-w-xl text-sm text-slate-500">{description}</p>
      {action}
    </div>
  );
}

export default EmptyState;
