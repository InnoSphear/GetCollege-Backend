import College from "../models/college.model.js";

export const createCollege = async (req, res) => {
  try {
    const college = await College.create(req.body);
    return res.status(201).json({
      success: true,
      data: college,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getAllColleges = async (req, res) => {
  try {
    const colleges = await College.find().sort({
      featuredRank: 1,
      featured: -1,
      rating: -1,
      roiScore: -1,
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      count: colleges.length,
      data: colleges,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getCollegeById = async (req, res) => {
  try {
    const { id } = req.params;
    const college = await College.findOne({
      $or: [{ _id: id }, { slug: id }],
    });

    if (!college) {
      return res.status(404).json({
        success: false,
        message: "College not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: college,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateCollege = async (req, res) => {
  try {
    const college = await College.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!college) {
      return res.status(404).json({
        success: false,
        message: "College not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: college,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteCollege = async (req, res) => {
  try {
    const college = await College.findByIdAndDelete(req.params.id);

    if (!college) {
      return res.status(404).json({
        success: false,
        message: "College not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "College deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const compareColleges = async (req, res) => {
  try {
    const ids = req.query.ids?.split(",").filter(Boolean) || [];

    if (ids.length < 2 || ids.length > 4) {
      return res.status(400).json({
        success: false,
        message: "Choose between 2 and 4 colleges to compare",
      });
    }

    const colleges = await College.find({ _id: { $in: ids } });

    const bestCollege = colleges
      .slice()
      .sort(
        (a, b) =>
          (b.roiScore || 0) +
          (b.rating || 0) +
          (b.placementRate || 0) / 10 -
          ((a.roiScore || 0) + (a.rating || 0) + (a.placementRate || 0) / 10)
      )[0];

    return res.status(200).json({
      success: true,
      data: {
        colleges,
        bestCollegeId: bestCollege?._id || null,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
