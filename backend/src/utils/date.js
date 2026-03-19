const addDays = (date, days) => {
  const value = new Date(date);
  value.setDate(value.getDate() + days);
  return value;
};

const isPast = (date) => new Date(date).getTime() < Date.now();

const businessDaysBetween = (startDate, endDate = new Date()) => {
  const current = new Date(startDate);
  const end = new Date(endDate);
  let count = 0;

  while (current <= end) {
    const day = current.getDay();
    if (day !== 0 && day !== 6) {
      count += 1;
    }
    current.setDate(current.getDate() + 1);
  }

  return Math.max(0, count - 1);
};

module.exports = {
  addDays,
  isPast,
  businessDaysBetween,
};
