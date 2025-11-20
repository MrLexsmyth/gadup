import express from "express";
import { protect, admin } from "../middleware/authMiddleware.js";
import { changePassword, adminLogin, getAdminProfile } from "../controllers/adminController.js";
import { dailyRevenue, topProduct, paymentSuccess  } from "../controllers/topSellController.js";
import { getIncomeStats } from "../controllers/IncomeController.js";

const router = express.Router();

// Admin login route
router.post("/login",  adminLogin);

//  Get logged-in admin profile
router.get("/me", protect, admin, getAdminProfile);
router.get("/income-stats", getIncomeStats);
router.get("/daily-revenue", dailyRevenue);
router.get("/top-products", topProduct);
router.get("/payment-success", paymentSuccess);
// Protected admin routes
router.get("/dashboard", protect, admin, (req, res) => {
  res.json({
    message: "Welcome Admin! You have access to the dashboard.",
    user: req.user,
  });
});

router.put("/change-password", protect, admin, changePassword);

export default router;
