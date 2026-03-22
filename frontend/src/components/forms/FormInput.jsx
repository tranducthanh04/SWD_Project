function FormInput({ label, error, ...props }) {
  return (
    <label className="block">
      <span className="field-label">{label}</span>
      <input className="field-input" {...props} />
      {error ? <span className="mt-1 block text-sm text-red-600">{error}</span> : null}
    </label>
  );
}

export default FormInput;
