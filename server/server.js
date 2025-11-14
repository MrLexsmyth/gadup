import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";

// Routes
import authRoutes from "./routes/authRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import adminOrderRoutes from "./routes/adminOrderRoutes.js";
import verifyPaymentRoutes from "./routes/verifyPayment.js";




dotenv.config();
const app = express();

// CORS setup
const allowedOrigins = [
  "http://localhost:3000",
  "https://gadup.vercel.app"
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  optionsSuccessStatus: 200,
}));


// Middleware
app.use(express.json());
app.use(cookieParser());

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB Connection Error:", err));

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/products", productRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/user", userRoutes);
app.use("/api/admin/orders", adminOrderRoutes);

app.use("/api/payment/verify", verifyPaymentRoutes);

// Test route
app.get("/api/test", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Frontend successfully connected to backend 🎉",
    server: process.env.SERVER_URL,
    client: process.env.CLIENT_URL,
  });
});

// Root route
app.get("/", (req, res) => {
  res.send("Server is running 🚀");
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
