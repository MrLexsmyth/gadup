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


const allowedOrigins = [
  "http://localhost:3000",
  "https://gadup.vercel.app"
];

app.use(cors({
  origin: function(origin, callback) {
    if (!origin) return callback(null, true); // allow curl, mobile apps
    if (allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true, // allow cookies
}));



app.use(express.json());
app.use(cookieParser());


mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log(" MongoDB Connected"))
  .catch((err) => console.error(" MongoDB Connection Error:", err));



app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/products", productRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/user", userRoutes);
app.use("/api/order", orderRoutes);
app.use("/api/admin/orders", adminOrderRoutes);


app.get("/api/test", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Frontend successfully connected to backend 🎉",
    server: process.env.SERVER_URL,
    client: process.env.CLIENT_URL,
  });
});


app.get("/", (req, res) => {
  res.send("Server is running 🚀");
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
