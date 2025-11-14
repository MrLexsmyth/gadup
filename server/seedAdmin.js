import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/User.js";
import connectDB from "./config/db.js";

dotenv.config();
connectDB();

const seedAdmin = async () => {
  try {
    // Delete any existing admin users
    await User.deleteMany({ isAdmin: true });

    // Create a new admin
    const admin = await User.create({
      name: "Admin User",
      email: "admin@example.com",
      password: "Ilovejesus12345678@", 
      isAdmin: true,
    });

    console.log("✅ New admin created:");
    console.log(admin);
    process.exit();
  } catch (error) {
    console.error("❌ Error seeding admin:", error.message);
    process.exit(1);
  }
};

seedAdmin();
