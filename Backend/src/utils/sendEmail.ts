import { createTransport } from "nodemailer";

const sendEmail = async (to: string, subject: string, html: string) => {
  if (
    !process.env.SMTP_HOST ||
    !process.env.SMTP_PORT ||
    !process.env.SMTP_USER ||
    !process.env.SMTP_PASS
  ) {
    throw new Error("SMTP configuration is not set in environment variables");
  }

  const transporter = createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT || 587,
    secure: process.env.NODE_ENV === "production",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to,
    subject,
    html,
  };

  const response = await transporter.sendMail(mailOptions);
  return response;
};

export default sendEmail;
