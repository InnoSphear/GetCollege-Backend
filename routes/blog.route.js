import express from "express";
import {
  createBlog,
  getAllBlogs,
  getBlogById,
  updateBlog,
  deleteBlog,
} from "../controllers/blog.controller.js";

const router = express.Router();

router.post("/blog", createBlog);
router.get("/blog", getAllBlogs);
router.get("/blog/:id", getBlogById);
router.put("/blog/:id", updateBlog);
router.delete("/blog/:id", deleteBlog);

export default router;
