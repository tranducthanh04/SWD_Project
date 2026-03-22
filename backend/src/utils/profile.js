const calculateJobSeekerProfileCompleted = (profile) => {
  if (!profile) return false;

  return Boolean(
    profile.education &&
      profile.summary &&
      Array.isArray(profile.skills) &&
      profile.skills.length > 0 &&
      typeof profile.experienceYears === 'number' &&
      profile.cvFileUrl,
  );
};

module.exports = {
  calculateJobSeekerProfileCompleted,
};
