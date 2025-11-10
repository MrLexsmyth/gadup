import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/User.js";
import connectDB from "./config/db.js";

dotenv.config();
await connectDB();

const checkAdmin = async () => {
  try {
    const admin = await User.findOne({ email: "admin@example.com" });
    console.log("Admin document found:", admin);
  } catch (err) {
    console.error("Error checking admin:", err);
  } finally {
    mongoose.connection.close();
  }
};

checkAdmin();
