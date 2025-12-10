import express from "express";
import multer from "multer";
import { uploadImage } from "../controllers/uploadController.js";

const router = express.Router();

// Store files temporarily before Cloudinary
const upload = multer({ dest: "uploads/" });

// Upload multiple images: "images"
router.post("/", upload.array("images", 10), uploadImage);

export default router;
