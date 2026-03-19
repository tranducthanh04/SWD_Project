const verificationEmailTemplate = ({ name, code }) => ({
  subject: 'Verify your account',
  text: `Hello ${name}, your verification code is ${code}. The code expires in 15 minutes.`,
  html: `<p>Hello <strong>${name}</strong>,</p><p>Your verification code is <strong>${code}</strong>.</p><p>The code expires in 15 minutes.</p>`,
});

const resetPasswordEmailTemplate = ({ name, code }) => ({
  subject: 'Reset your password',
  text: `Hello ${name}, your reset code is ${code}. The code expires in 15 minutes.`,
  html: `<p>Hello <strong>${name}</strong>,</p><p>Your password reset code is <strong>${code}</strong>.</p><p>The code expires in 15 minutes.</p>`,
});

module.exports = {
  verificationEmailTemplate,
  resetPasswordEmailTemplate,
};
