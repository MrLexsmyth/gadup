import express from "express";
import { protect, admin } from "../middleware/authMiddleware.js";
import { changePassword, adminLogin, getAdminProfile } from "../controllers/adminController.js";

const router = express.Router();

// Admin login route
router.post("/login", adminLogin);

// ✅ Get logged-in admin profile
router.get("/me", protect, admin, getAdminProfile);

// Protected admin routes
router.get("/dashboard", protect, admin, (req, res) => {
  res.json({
    message: "Welcome Admin! You have access to the dashboard.",
    user: req.user,
  });
});

router.put("/change-password", protect, admin, changePassword);

export default router;
