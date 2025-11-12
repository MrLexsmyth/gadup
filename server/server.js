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
import orderRoutes from "./routes/order.js";
import adminOrderRoutes from "./routes/adminOrderRoutes.js";

dotenv.config();
const app = express();

// ✅ Allowed origins
const allowedOrigins = [
  "http://localhost:3000",       // Local dev
  "https://gadup.vercel.app",    // Vercel frontend
].filter(Boolean);

// ✅ CORS configuration
app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (curl, mobile apps)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      console.error("❌ CORS blocked request from:", origin);
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true, // allow cookies/auth headers
  })
);

// ✅ Middleware
app.use(express.json());
app.use(cookieParser());

// ✅ Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// ✅ Routes
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/products", productRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/user", userRoutes);
app.use("/api/order", orderRoutes);
app.use("/api/admin/orders", adminOrderRoutes);

// ✅ Test route
app.get("/api/test", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Frontend successfully connected to backend 🎉",
    server: process.env.SERVER_URL,
    client: process.env.CLIENT_URL,
  });
});

// ✅ Root route
app.get("/", (req, res) => {
  res.send("Server is running 🚀");
});

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
