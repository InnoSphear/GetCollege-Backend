import College from "../models/college.model.js";
import User from "../models/user.model.js";
import Blog from "../models/blog.model.js";

export const getAdminAnalytics = async (_req, res) => {
  try {
    const [users, colleges, blogs] = await Promise.all([
      User.find().populate("savedColleges comparisonHistory.colleges"),
      College.find(),
      Blog.find(),
    ]);

    const totalLeads = users.length;
    const totalColleges = colleges.length;
    const totalBlogs = blogs.length;
    const totalSaved = users.reduce((sum, user) => sum + (user.savedColleges?.length || 0), 0);
    const totalComparisons = users.reduce(
      (sum, user) => sum + (user.comparisonHistory?.length || 0),
      0
    );

    const leadStatus = users.reduce((acc, user) => {
      acc[user.status] = (acc[user.status] || 0) + 1;
      return acc;
    }, {});

    const categoryBreakdown = colleges.reduce((acc, college) => {
      const key = college.category || "Other";
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});

    const topColleges = colleges
      .slice()
      .sort(
        (a, b) =>
          (b.rating || 0) + (b.roiScore || 0) + (b.placementRate || 0) / 10 -
          ((a.rating || 0) + (a.roiScore || 0) + (a.placementRate || 0) / 10)
      )
      .slice(0, 5)
      .map((college) => ({
        _id: college._id,
        name: college.name,
        rating: college.rating,
        roiScore: college.roiScore,
        placementRate: college.placementRate,
      }));

    return res.status(200).json({
      success: true,
      data: {
        totals: {
          totalLeads,
          totalColleges,
          totalBlogs,
          totalSaved,
          totalComparisons,
        },
        leadStatus,
        categoryBreakdown,
        topColleges,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
