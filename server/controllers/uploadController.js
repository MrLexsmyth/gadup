import fs from "fs";
import cloudinary from "../config/cloudinary.js";

export const uploadImage = async (req, res) => {
  try {
    // Expecting multiple files: req.files
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No files uploaded" });
    }

    let uploadedImages = [];

    // Loop through all uploaded files
    for (const file of req.files) {
      const result = await cloudinary.uploader.upload(file.path, {
        folder: "products",
      });

      // Add uploaded image info
      uploadedImages.push({
        url: result.secure_url,
        public_id: result.public_id,
      });

      // Delete temp file
      fs.unlinkSync(file.path);
    }

    res.json({
      message: "Images uploaded successfully",
      images: uploadedImages,
    });
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    res.status(500).json({ message: "Upload failed", error });
  }
};
