import nodemailer from "nodemailer";
export const sendEmails = async (to, subject, html) => {
  // sender
  const transporter = nodemailer.createTransport({
    host: "localhost",
    service: "gmail",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  }); // <-- Added closing parenthesis here

  // receiver
  const info = await transporter.sendMail({
    from: `"E-commerce App" <${process.env.EMAIL_USER}>`, // sender address
    to,
    subject,
    html,
  });
  if (info.rejected.length > 0) return false;
  return true;
};
