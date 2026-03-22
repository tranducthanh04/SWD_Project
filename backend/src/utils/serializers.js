const sanitizeUser = (user) => {
  if (!user) return null;
  const value = user.toObject ? user.toObject() : { ...user };
  delete value.passwordHash;
  return value;
};

module.exports = {
  sanitizeUser,
};
