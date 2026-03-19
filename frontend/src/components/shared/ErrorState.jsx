function ErrorState({ title = 'Something went wrong', description = 'Please try again.' }) {
  return (
    <div className="card-panel border-red-200 bg-red-50 p-6 text-red-700">
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="mt-2 text-sm">{description}</p>
    </div>
  );
}

export default ErrorState;
