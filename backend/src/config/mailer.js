const nodemailer = require('nodemailer');
const env = require('./env');

let transporter;

if (env.smtpHost && env.smtpUser && env.smtpPass) {
  transporter = nodemailer.createTransport({
    host: env.smtpHost,
    port: env.smtpPort,
    secure: env.smtpSecure,
    auth: {
      user: env.smtpUser,
      pass: env.smtpPass,
    },
  });
} else {
  transporter = nodemailer.createTransport({
    jsonTransport: true,
  });
}

module.exports = transporter;
