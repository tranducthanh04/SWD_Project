const transporter = require('../config/mailer');
const env = require('../config/env');
const { verificationEmailTemplate, resetPasswordEmailTemplate } = require('../utils/mailTemplates');

const sendEmail = async ({ to, template }) => {
  const payload = await transporter.sendMail({
    from: env.mailFrom,
    to,
    subject: template.subject,
    text: template.text,
    html: template.html,
  });

  if (payload.message) {
    console.log(`Email payload for ${to}: ${payload.message}`);
  }

  return payload;
};

const sendVerificationCodeEmail = (email, name, code) =>
  sendEmail({
    to: email,
    template: verificationEmailTemplate({ name, code }),
  });

const sendResetPasswordCodeEmail = (email, name, code) =>
  sendEmail({
    to: email,
    template: resetPasswordEmailTemplate({ name, code }),
  });

module.exports = {
  sendVerificationCodeEmail,
  sendResetPasswordCodeEmail,
};
