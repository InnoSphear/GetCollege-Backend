import LandingPage from "../models/landingPage.model.js";

const toSlug = (value) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

export const createLandingPage = async (req, res) => {
  try {
    const payload = { ...req.body };

    if (!payload.title || !payload.bannerImage) {
      return res.status(400).json({
        success: false,
        message: "Title and banner image are required",
      });
    }

    const slug = payload.slug ? toSlug(payload.slug) : toSlug(payload.title);
    payload.slug = slug;

    const existing = await LandingPage.findOne({ slug });
    if (existing) {
      payload.slug = `${slug}-${Date.now()}`;
    }

    const landingPage = await LandingPage.create(payload);
    return res.status(201).json({ success: true, data: landingPage });
  } catch (error) {
    console.error("Create landing page error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllLandingPages = async (req, res) => {
  try {
    const landingPages = await LandingPage.find().sort({ createdAt: -1 });
    return res.status(200).json({ success: true, count: landingPages.length, data: landingPages });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getLandingPageBySlug = async (req, res) => {
  try {
    const landingPage = await LandingPage.findOne({ slug: req.params.slug });
    if (!landingPage) {
      return res.status(404).json({ success: false, message: "Landing page not found" });
    }
    return res.status(200).json({ success: true, data: landingPage });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getLandingPageById = async (req, res) => {
  try {
    const landingPage = await LandingPage.findById(req.params.id);
    if (!landingPage) {
      return res.status(404).json({ success: false, message: "Landing page not found" });
    }
    return res.status(200).json({ success: true, data: landingPage });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateLandingPage = async (req, res) => {
  try {
    const payload = { ...req.body };
    if (payload.slug) {
      payload.slug = toSlug(payload.slug);
    }

    const landingPage = await LandingPage.findByIdAndUpdate(req.params.id, payload, {
      new: true,
      runValidators: true,
    });

    if (!landingPage) {
      return res.status(404).json({ success: false, message: "Landing page not found" });
    }
    return res.status(200).json({ success: true, data: landingPage });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteLandingPage = async (req, res) => {
  try {
    const landingPage = await LandingPage.findByIdAndDelete(req.params.id);
    if (!landingPage) {
      return res.status(404).json({ success: false, message: "Landing page not found" });
    }
    return res.status(200).json({ success: true, message: "Landing page deleted successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};