import nodemailer from "nodemailer";
import ENV_CONFIG from "./env.config";

const mailer = nodemailer.createTransport({
  host: ENV_CONFIG.smtp.host,
  port: ENV_CONFIG.smtp.port,
  secure: ENV_CONFIG.smtp.port === 465,
  auth: {
    user: ENV_CONFIG.smtp.user,
    pass: ENV_CONFIG.smtp.pass,
  },
});

export default mailer;
