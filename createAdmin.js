import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import Admin from "./models/Admin.js";

dotenv.config();

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const hashedPassword = await bcrypt.hash("admin123", 10);

    const admin = new Admin({
      username: "admin",
      password: hashedPassword,
    });

    await admin.save();
    console.log("Admin created successfully");

    mongoose.disconnect();
  } catch (err) {
    console.log(err);
  }
};

createAdmin();
