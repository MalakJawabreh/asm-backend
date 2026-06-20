import express from "express";
// import dotenv from "dotenv";
import emailRoutes from "./routes/emailRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import postRoutes from "./routes/postRoutes.js"; // <-- مهم جدًا
import mongoose from "mongoose";
import cors from "cors";

// dotenv.config();
const app = express();
app.use(
  cors({
    origin: "https://www.asmdesignco.com",
  }),
);
app.use(express.json());
mongoose
  .connect(process.env.MONGO_URI) // بس خليها هيك بدون أي خيارات إضافية
  .then(() => console.log("DB connected"))
  .catch((err) => console.log("DB Error:", err));

// Routes
app.use("/api/email", emailRoutes);
app.use("/api/auth", adminRoutes);
app.use("/api/posts", postRoutes); // <<<<<<<< مهم جدًا
console.log("MONGO_URI =", process.env.MONGO_URI);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
app.use((err, req, res, next) => {
  console.log("🔥 GLOBAL ERROR:", JSON.stringify(err, null, 2));
  return res.status(500).json({
    message: "Global server error",
    error: err,
  });
});
