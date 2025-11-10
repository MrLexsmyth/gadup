import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../models/User.js"; // adjust path if needed

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    process.exit(1);
  }
};

const addAddressesToUsers = async () => {
  try {
    const result = await User.updateMany(
      { addresses: { $exists: false } }, // only users without addresses
      { $set: { addresses: [] } }
    );

    console.log(`Updated ${result.modifiedCount} users with addresses array`);
    process.exit();
  } catch (error) {
    console.error("Error updating users:", error);
    process.exit(1);
  }
};

const run = async () => {
  await connectDB();
  await addAddressesToUsers();
};

run();
