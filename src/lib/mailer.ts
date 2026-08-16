import nodemailer from "nodemailer";

const smtpHost = process.env.SMTP_HOST || "smtp.gmail.com";
const smtpPort = parseInt(process.env.SMTP_PORT || "587");
const smtpUser = process.env.SMTP_USER || "";
const smtpPass = process.env.SMTP_PASS || "";
const smtpFrom = process.env.SMTP_FROM || "Hotel Rajhans International <info@hotelrajhansinternational.com>";

const transporter = nodemailer.createTransport({
  host: smtpHost,
  port: smtpPort,
  secure: smtpPort === 465,
  auth: smtpUser ? { user: smtpUser, pass: smtpPass } : undefined,
});

export async function sendEmailNotification({
  to,
  subject,
  html,
  text,
}: {
  to: string;
  subject: string;
  html: string;
  text?: string;
}): Promise<boolean> {
  try {
    if (!smtpUser || !smtpPass) {
      console.log(`[MAILER SIMULATION] To: ${to} | Subject: ${subject}`);
      return true;
    }

    await transporter.sendMail({
      from: smtpFrom,
      to,
      subject,
      html,
      text: text || subject,
    });
    return true;
  } catch (error) {
    console.error("Failed to send email notification:", error);
    return false;
  }
}
