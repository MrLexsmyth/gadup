import express from "express";
import { verifyPayment } from "../controllers/orderController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// POST /api/payment/verify
router.post("/", protect, verifyPayment);

export default router;
