import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import Admin from "../models/Admin.js";
import { adminAuth } from "../middleware/auth.js";

const router = express.Router();

router.post("/login", async (req, res) => {
  console.log("🔥 LOGIN REQUEST ARRIVED");
  console.log("BODY:", req.body);

  try {
    const { username, password } = req.body;

    const admin = await Admin.findOne({ username });
    if (!admin) {
      return res.status(400).json({ message: "Invalid username" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Wrong password" });
    }

    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.json({ token });
  } catch (err) {
    console.log("❌ ERROR:", err);
    return res.status(500).json({
      message: err.message,
      error: err,
    });
  }
});

router.put("/update", adminAuth, async (req, res) => {
  try {
    const { username, password } = req.body;
    const admin = await Admin.findById(req.adminId);

    if (username) admin.username = username;
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      admin.password = hashedPassword;
    }

    await admin.save();
    res.json({ message: "Admin updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
