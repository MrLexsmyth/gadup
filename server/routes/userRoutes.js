import express from "express";
import { registerUser, loginUser, getUserProfile, updateAddress } from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", protect, getUserProfile);
router.put("/address", protect, updateAddress);

export default router;
