import Blog from "../models/blog.model.js";

const toSlug = (value) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

export const createBlog = async (req, res) => {
  try {
    const payload = { ...req.body };

    if (!payload.title || !payload.excerpt || !payload.content || !payload.coverImage) {
      return res.status(400).json({
        success: false,
        message: "Title, excerpt, content and cover image are required",
      });
    }

    const slug = payload.slug ? toSlug(payload.slug) : toSlug(payload.title);
    payload.slug = slug;

    const blog = await Blog.create(payload);
    return res.status(201).json({ success: true, data: blog });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    return res.status(200).json({ success: true, count: blogs.length, data: blogs });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ success: false, message: "Blog not found" });
    }
    return res.status(200).json({ success: true, data: blog });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateBlog = async (req, res) => {
  try {
    const payload = { ...req.body };
    if (payload.slug) {
      payload.slug = toSlug(payload.slug);
    }

    const blog = await Blog.findByIdAndUpdate(req.params.id, payload, {
      new: true,
      runValidators: true,
    });

    if (!blog) {
      return res.status(404).json({ success: false, message: "Blog not found" });
    }
    return res.status(200).json({ success: true, data: blog });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);
    if (!blog) {
      return res.status(404).json({ success: false, message: "Blog not found" });
    }
    return res.status(200).json({ success: true, message: "Blog deleted successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
