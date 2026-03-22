function FileUploader({ label, error, ...props }) {
  return (
    <label className="block">
      <span className="field-label">{label}</span>
      <input className="field-input file:mr-4 file:rounded-xl file:border-0 file:bg-brand-50 file:px-3 file:py-2 file:font-semibold file:text-brand-700" type="file" {...props} />
      {error ? <span className="mt-1 block text-sm text-red-600">{error}</span> : null}
    </label>
  );
}

export default FileUploader;
