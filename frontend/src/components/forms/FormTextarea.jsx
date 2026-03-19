function FormTextarea({ label, error, ...props }) {
  return (
    <label className="block">
      <span className="field-label">{label}</span>
      <textarea className="field-input min-h-32" {...props} />
      {error ? <span className="mt-1 block text-sm text-red-600">{error}</span> : null}
    </label>
  );
}

export default FormTextarea;
