import { sendEmailService } from "../services/emailService.js";

export const sendEmailController = async (req, res) => {
  try {
    const result = await sendEmailService(req.body);
    res.status(200).json({ message: "Email sent", result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error sending email" });
  }
};
