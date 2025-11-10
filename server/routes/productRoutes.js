// server/routes/productRoutes.js
import express from "express";
import multer from "multer"; // ✅ Import multer
import { protect, admin } from "../middleware/authMiddleware.js";
import {
  createProduct,
  deleteProduct,
  updateProduct,
  getProducts,
  getProductById,
} from "../controllers/productController.js";

const router = express.Router();

// ✅ Configure multer
const upload = multer({ dest: "uploads/" });

// 🟢 CREATE PRODUCT (Admin only)
router.post("/", protect, admin, upload.single("image"), createProduct);

// 🔵 GET ALL PRODUCTS (Public)
router.get("/", getProducts);

// 🟡 GET SINGLE PRODUCT (Public)
router.get("/:id", getProductById);

// 🟠 UPDATE PRODUCT (Admin only, with image upload)
router.put("/:id", protect, admin, upload.single("image"), updateProduct);

// 🔴 DELETE PRODUCT (Admin only)
router.delete("/:id", protect, admin, deleteProduct);

export default router;
