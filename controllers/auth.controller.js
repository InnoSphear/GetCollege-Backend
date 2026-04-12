import jwt from "jsonwebtoken";

const ADMIN_ID = process.env.ADMIN_ID || "6203818011";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "Admin@123";
const JWT_SECRET = process.env.JWT_SECRET || "getcollege-admin-secret";

export const adminLogin = async (req, res) => {
  try {
    const { mobile, password } = req.body;

    if (!mobile || !password) {
      return res.status(400).json({
        success: false,
        message: "Mobile and password are required",
      });
    }

    if (mobile !== ADMIN_ID || password !== ADMIN_PASSWORD) {
      return res.status(401).json({
        success: false,
        message: "Invalid admin credentials",
      });
    }

    const token = jwt.sign({ role: "admin", mobile }, JWT_SECRET, {
      expiresIn: "7d",
    });

    return res.status(200).json({
      success: true,
      token,
      admin: {
        mobile,
        role: "admin",
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const verifyAdmin = async (req, res) => {
  return res.status(200).json({
    success: true,
    admin: req.admin,
  });
};
