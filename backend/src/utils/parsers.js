const parseArrayInput = (value) => {
  if (Array.isArray(value)) return value.filter(Boolean);
  if (typeof value !== 'string') return [];

  const trimmed = value.trim();
  if (!trimmed) return [];

  try {
    const parsed = JSON.parse(trimmed);
    return Array.isArray(parsed) ? parsed.filter(Boolean) : [];
  } catch (_error) {
    return trimmed
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);
  }
};

const parseObjectInput = (value) => {
  if (!value) return {};
  if (typeof value === 'object') return value;

  try {
    return JSON.parse(value);
  } catch (_error) {
    return {};
  }
};

module.exports = {
  parseArrayInput,
  parseObjectInput,
};
