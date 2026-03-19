function FilterPanel({ filters, onChange, jobTypes, experienceLevels }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
      <input className="field-input" placeholder="City" value={filters.city || ''} onChange={(event) => onChange('city', event.target.value)} />
      <select className="field-input" value={filters.jobType || ''} onChange={(event) => onChange('jobType', event.target.value)}>
        <option value="">All job types</option>
        {jobTypes.map((item) => (
          <option key={item} value={item}>
            {item}
          </option>
        ))}
      </select>
      <select className="field-input" value={filters.experienceLevel || ''} onChange={(event) => onChange('experienceLevel', event.target.value)}>
        <option value="">All experience levels</option>
        {experienceLevels.map((item) => (
          <option key={item} value={item}>
            {item}
          </option>
        ))}
      </select>
      <input className="field-input" type="number" placeholder="Min salary" value={filters.salaryMin || ''} onChange={(event) => onChange('salaryMin', event.target.value)} />
      <input className="field-input" type="number" placeholder="Max salary" value={filters.salaryMax || ''} onChange={(event) => onChange('salaryMax', event.target.value)} />
    </div>
  );
}

export default FilterPanel;
