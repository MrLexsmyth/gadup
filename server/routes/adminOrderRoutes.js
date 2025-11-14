import express from "express";
import { getAllOrders, updateOrderStatus } from "../controllers/adminOrderController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

// Get all orders
router.get("/", protect, admin, getAllOrders);

// Update order status (optional, e.g., mark as "shipped" or "delivered")
router.put("/:id/status", protect, admin, updateOrderStatus);

export default router;


