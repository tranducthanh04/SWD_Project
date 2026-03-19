export const currency = (min, max, unit = 'USD') => `${unit} ${Number(min).toLocaleString()} - ${Number(max).toLocaleString()}`;

export const dateDisplay = (value) =>
  value
    ? new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      }).format(new Date(value))
    : '-';

export const statusTone = (status = '') => {
  const normalized = status.toLowerCase();
  if (normalized.includes('published') || normalized.includes('verified') || normalized.includes('pass') || normalized.includes('offered') || normalized.includes('resolved')) {
    return 'success';
  }
  if (normalized.includes('processing') || normalized.includes('pending') || normalized.includes('interview')) {
    return 'warning';
  }
  if (normalized.includes('rejected') || normalized.includes('fail') || normalized.includes('banned') || normalized.includes('deleted') || normalized.includes('closed') || normalized.includes('withdrawn')) {
    return 'danger';
  }
  return 'neutral';
};

export const getErrorMessage = (error, fallback = 'Request failed') => error?.response?.data?.message || fallback;
