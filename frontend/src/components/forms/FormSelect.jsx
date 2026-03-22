function FormSelect({ label, error, options, ...props }) {
  return (
    <label className="block">
      <span className="field-label">{label}</span>
      <select className="field-input" {...props}>
        <option value="">Chọn</option>
        {options.map((option) => (
          <option key={option.value || option} value={option.value || option}>
            {option.label || option}
          </option>
        ))}
      </select>
      {error ? <span className="mt-1 block text-sm text-red-600">{error}</span> : null}
    </label>
  );
}

export default FormSelect;