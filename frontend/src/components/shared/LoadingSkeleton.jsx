function LoadingSkeleton({ rows = 3 }) {
  return (
    <div className="card-panel p-6">
      <div className="animate-pulse space-y-4">
        {Array.from({ length: rows }).map((_, index) => (
          <div key={index} className="h-4 rounded-full bg-slate-200" />
        ))}
      </div>
    </div>
  );
}

export default LoadingSkeleton;
