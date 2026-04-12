import User from "../models/user.model.js";

export const register = async (req, res) => {
  try {
    const {
      name,
      email,
      mobile,
      course,
      state,
      city,
      budget,
      careerGoal,
      preferredMode,
      source,
      status,
      notes,
      savedColleges,
      comparisonHistory,
    } = req.body;

    if (!name || !email || !mobile || !course) {
      return res.status(400).json({
        success: false,
        message: "Name, email, mobile, and course are required",
      });
    }

    const existingUser = await User.findOne({
      $or: [{ email }, { mobile }],
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Lead already exists with this email or mobile",
      });
    }

    const user = await User.create({
      name,
      email,
      mobile,
      course,
      state,
      city,
      budget,
      careerGoal,
      preferredMode,
      source,
      status,
      notes,
      savedColleges,
      comparisonHistory,
    });

    return res.status(200).json({
      success: true,
      message: "Lead created successfully",
      data: user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getUser = async (_req, res) => {
  try {
    const getUser = await User.find()
      .populate("savedColleges", "name slug logo")
      .populate("comparisonHistory.colleges", "name slug logo");
    return res.status(200).json({
      success: true,
      getUser,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const updateLead = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
      .populate("savedColleges", "name slug logo")
      .populate("comparisonHistory.colleges", "name slug logo");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Lead not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const deleteLead = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Lead not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Lead deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
