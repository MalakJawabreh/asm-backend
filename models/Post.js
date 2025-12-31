import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  images: [String], // array of image URLs
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Post", postSchema);
