import jwt from "jsonwebtoken";
import User from "../models/User.js";

// ==========================
// Protect Middleware
// ==========================
export const protect = async (req, res, next) => {
  try {
    const token = req.cookies.jwt; // ✅ Read token from cookie

    if (!token) {
      return res.status(401).json({ message: "Not authorized, no token" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");

    if (!req.user) {
      return res.status(401).json({ message: "User not found" });
    }

    next();
  } catch (error) {
    console.error("Auth error:", error);
    res.status(401).json({ message: "Not authorized, invalid token" });
  }
};

// ==========================
// Admin-only Middleware
// ==========================
export const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(403).json({ message: "Not authorized as admin" });
  }
};

