function FilterPanel({ filters, onChange, jobTypes, experienceLevels }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
      <input className="field-input" placeholder="Thành phố" value={filters.city || ''} onChange={(event) => onChange('city', event.target.value)} />
      <select className="field-input" value={filters.jobType || ''} onChange={(event) => onChange('jobType', event.target.value)}>
        <option value="">Tất cả hình thức</option>
        {jobTypes.map((item) => (
          <option key={item.value || item} value={item.value || item}>
            {item.label || item}
          </option>
        ))}
      </select>
      <select className="field-input" value={filters.experienceLevel || ''} onChange={(event) => onChange('experienceLevel', event.target.value)}>
        <option value="">Tất cả cấp độ</option>
        {experienceLevels.map((item) => (
          <option key={item.value || item} value={item.value || item}>
            {item.label || item}
          </option>
        ))}
      </select>
      <input className="field-input" type="number" placeholder="Lương tối thiểu" value={filters.salaryMin || ''} onChange={(event) => onChange('salaryMin', event.target.value)} />
      <input className="field-input" type="number" placeholder="Lương tối đa" value={filters.salaryMax || ''} onChange={(event) => onChange('salaryMax', event.target.value)} />
    </div>
  );
}

export default FilterPanel;