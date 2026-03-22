const durationToMs = (value) => {
  const matched = /^(\d+)([mhd])$/.exec(value || '');
  if (!matched) {
    return 0;
  }

  const amount = Number(matched[1]);
  const unit = matched[2];

  if (unit === 'm') return amount * 60 * 1000;
  if (unit === 'h') return amount * 60 * 60 * 1000;
  return amount * 24 * 60 * 60 * 1000;
};

module.exports = {
  durationToMs,
};
