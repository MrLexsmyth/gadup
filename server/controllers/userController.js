import User from "../models/User.js";
import Order from "../models/Order.js";
import bcrypt from "bcryptjs"; // or require("bcryptjs")


import jwt from "jsonwebtoken";

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

// Register
export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists)
      return res.status(400).json({ message: "User already exists" });

    const user = await User.create({ name, email, password });
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(400).json({ message: "Invalid user data", error: error.message });
  }
};

// Login
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    // Fetch orders for this user
    const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });

    res.json({ ...user.toObject(), orders }); // include orders in response
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
// Add/Edit/Delete Address
export const updateAddress = async (req, res) => {
  try {
    const { action, address } = req.body; // action: "add" | "edit" | "delete"
    const user = await User.findById(req.user.id);

    if (!user) return res.status(404).json({ message: "User not found" });

    // Ensure addresses array exists (for older users)
    if (!Array.isArray(user.addresses)) {
      user.addresses = [];
    }

    switch (action) {
      case "add":
        user.addresses.push(address);
        break;

      case "edit":
        if (!address._id)
          return res.status(400).json({ message: "Address ID required for edit" });
        user.addresses = user.addresses.map((addr) =>
          addr._id.toString() === address._id
            ? { ...addr.toObject(), ...address }
            : addr
        );
        break;

      case "delete":
        if (!address._id)
          return res.status(400).json({ message: "Address ID required for delete" });
        user.addresses = user.addresses.filter(
          (addr) => addr._id.toString() !== address._id
        );
        break;

      default:
        return res.status(400).json({ message: "Invalid action" });
    }

    await user.save();
    res.json({ message: "Address updated successfully", addresses: user.addresses });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword)
      return res.status(400).json({ message: "Please provide all fields" });

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Current password is incorrect" });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};