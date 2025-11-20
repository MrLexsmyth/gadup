import User from "../models/User.js";
import jwt from "jsonwebtoken";


// ==========================
// Generate JWT Helper
// ==========================
const generateToken = (res, userId) => {
  const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });

res.cookie("jwt", token, {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production", // true in production
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  maxAge: 24 * 60 * 60 * 1000,
});


};

// ==========================
// Admin Login Controller
// ==========================
export const adminLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await User.findOne({ email });

    if (!admin || !admin.isAdmin) {
      return res.status(401).json({ message: "Invalid email or not an admin" });
    }

    const isMatch = await admin.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Generate token and send as cookie
    generateToken(res, admin._id);

    res.status(200).json({
      message: "Admin login successful",
      user: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
      },
    });
  } catch (error) {
    console.error("Admin login error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ==========================
// Change Password Controller
// ==========================
export const changePassword = async (req, res) => {
  try {
    const admin = await User.findById(req.user._id);

    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    const { currentPassword, newPassword } = req.body;

    const isMatch = await admin.matchPassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    admin.password = newPassword;
    await admin.save();

    res.json({ message: "Password changed successfully" });
  } catch (error) {
    console.error("Password change error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

//  Get current logged-in admin
export const getAdminProfile = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Not authorized" });
    }

    res.json({
      _id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      isAdmin: req.user.isAdmin,
    });
  } catch (error) {
    console.error("Error fetching admin profile:", error);
    res.status(500).json({ message: "Server error" });
  }
};
