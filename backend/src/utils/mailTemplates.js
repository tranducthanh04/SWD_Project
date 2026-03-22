const verificationEmailTemplate = ({ name, code }) => ({
  subject: 'Xác minh tài khoản của bạn',
  text: `Xin chào ${name}, mã xác minh của bạn là ${code}. Mã sẽ hết hạn sau 15 phút.`,
  html: `<p>Xin chào <strong>${name}</strong>,</p><p>Mã xác minh của bạn là <strong>${code}</strong>.</p><p>Mã sẽ hết hạn sau 15 phút.</p>`,
});

const resetPasswordEmailTemplate = ({ name, code }) => ({
  subject: 'Đặt lại mật khẩu của bạn',
  text: `Xin chào ${name}, mã đặt lại mật khẩu của bạn là ${code}. Mã sẽ hết hạn sau 15 phút.`,
  html: `<p>Xin chào <strong>${name}</strong>,</p><p>Mã đặt lại mật khẩu của bạn là <strong>${code}</strong>.</p><p>Mã sẽ hết hạn sau 15 phút.</p>`,
});

module.exports = {
  verificationEmailTemplate,
  resetPasswordEmailTemplate,
};
