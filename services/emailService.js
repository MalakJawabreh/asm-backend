import { transporter } from "../emailConfig.js"; // <--- مهم جدًا

export const sendEmailService = async ({ name, email, title, message }) => {
  const mailOptions = {
    from: `"${name}" <${process.env.EMAIL_USER}>`, // الاسم يظهر بدل "me"
    replyTo: email, // إرسال الرد يرجع لمستخدم
    to: process.env.EMAIL_USER, // إيميلك إنتِ فقط
    subject: `${name} — ${title}`, // اسم المرسل فوق عنوان الرسالة
    text: `
From : ${name}
Email :${email}
Message : ${message}
    `,
  };
  return await transporter.sendMail(mailOptions);
};
