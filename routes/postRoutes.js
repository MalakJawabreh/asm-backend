import express from "express";
import { adminAuth } from "../middleware/auth.js";
import upload from "../config/multer.js";
import Post from "../models/Post.js";
import cloudinary from "../config/cloudinary.js";

const router = express.Router();

router.post(
  "/create",
  adminAuth,
  upload.array("images", 30),
  async (req, res) => {
    try {
      // Cloudinary gives direct URLs
      const uploadedImages = await Promise.all(
        req.files.map(async (file) => {
          const result = await cloudinary.uploader.upload(file.path);
          console.log("Cloudinary URL:", result.secure_url);
          return result.secure_url;
        })
      );

      const post = new Post({
        title: req.body.title,
        description: req.body.description,
        images: uploadedImages, // الآن كل صورة رابط مباشر من Cloudinary
      });

      await post.save();

      res.json({ message: "Post created successfully", post });
    } catch (err) {
      console.log("===== FULL ERROR BELOW =====");
      console.log(JSON.stringify(err, null, 2));
      console.dir(err, { depth: null });

      return res.status(500).json({
        message: "Error creating post",
        error: err.message,
      });
    }
  }
);

// GET /posts
router.get("/getall", async (req, res) => {
  try {
    // جلب كل البوستات، أحدث أولاً
    const posts = await Post.find().sort({ createdAt: -1 });

    res.json({ message: "Posts fetched successfully", posts });
  } catch (err) {
    console.log("===== FULL ERROR BELOW =====");
    console.log(JSON.stringify(err, null, 2));
    console.dir(err, { depth: null });

    res.status(500).json({
      message: "Error fetching posts",
      error: err.message,
    });
  }
});
// DELETE /posts/delete/:id
router.delete("/delete/:id", adminAuth, async (req, res) => {
  try {
    const { id } = req.params;

    // Check if the post exists
    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Delete post from DB
    await Post.findByIdAndDelete(id);

    res.json({
      message: "Post deleted successfully",
      deletedPostId: id,
    });
  } catch (err) {
    console.log("===== FULL ERROR BELOW =====");
    console.log(JSON.stringify(err, null, 2));
    console.dir(err, { depth: null });

    res.status(500).json({
      message: "Error deleting post",
      error: err.message,
    });
  }
});

export default router;
