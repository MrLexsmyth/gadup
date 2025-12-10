import express from "express";
import multer from "multer";
import { protect, admin } from "../middleware/authMiddleware.js";
import {
  createProduct,
  deleteProduct,
  updateProduct,
  getProducts,
  getProductById,
} from "../controllers/productController.js";

const router = express.Router();

// ⬅️ Multer config (temporary storage)
const upload = multer({ dest: "uploads/" });

// 🟢 CREATE PRODUCT — allow multiple images
router.post("/", protect, admin, upload.array("images", 10), createProduct);

// 🔵 GET ALL PRODUCTS
router.get("/", getProducts);

// 🟡 GET SINGLE PRODUCT
router.get("/:id", getProductById);

// 🟠 UPDATE PRODUCT — also allow multiple images
router.put("/:id", protect, admin, upload.array("images", 10), updateProduct);

// 🔴 DELETE PRODUCT
router.delete("/:id", protect, admin, deleteProduct);

export default router;
