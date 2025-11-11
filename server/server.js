import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/authRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import orderRoutes from "./routes/order.js";
import adminOrderRoutes from "./routes/adminOrderRoutes.js";


dotenv.config();

const app = express();

// ✅ Configure CORS properly
const allowedOrigins = [
  'http://localhost:3000',
  process.env.SERVER_URL,
  process.env.CLIENT_URL,
].filter(Boolean);

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true, // ✅ allows cookies (including HttpOnly)
  })
);


// Middleware
app.use(express.json());

app.use(cookieParser());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/products", productRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/user", userRoutes);
app.use("/api/order", orderRoutes);
app.use("/api/admin/orders", adminOrderRoutes);

// Test Route
app.get("/", (req, res) => {
  res.send("Server is running 🚀");
});

// Server listen
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
