import express from "express";
import multer from "multer";
import { uploadImage } from "../controllers/uploadController.js";

const router = express.Router();

// Store temporarily before uploading to Cloudinary
const upload = multer({ dest: "uploads/" });

// ✅ Must match formData.append("image", image) in your frontend
router.post("/", upload.single("image"), uploadImage);

export default router;
