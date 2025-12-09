import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import Product from "./models/Product.js"; // adjust path

async function start() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");

    const result = await Product.updateMany(
      {},
      { $set: { discountPrice: 0, discountPercentage: 0 } }
    );

    console.log("Updated products:", result.modifiedCount);
    process.exit();
  } catch (error) {
    console.error("Error updating products:", error);
    process.exit(1);
  }
}

start();
