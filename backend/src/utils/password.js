const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/;

const isStrongPassword = (value) => PASSWORD_REGEX.test(value);

module.exports = {
  PASSWORD_REGEX,
  isStrongPassword,
};
