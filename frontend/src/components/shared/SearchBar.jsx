function SearchBar({ value, onChange, placeholder = 'Tìm kiếm việc làm...' }) {
  return <input className="field-input" value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} />;
}

export default SearchBar;