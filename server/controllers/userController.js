import User from "../models/User.js";
import Order from "../models/Order.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// ==============================
// Generate JWT + Set Cookie
// ==============================
const generateToken = (res, userId) => {
  const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "3d",
  });

  res.cookie("jwt", token, {
    httpOnly: true,
    secure: true,           
    sameSite: "none",       
    maxAge: 3 * 24 * 60 * 60 * 1000, 
  });

  return token;
};

// ==============================
// REGISTER USER
// ==============================
export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists)
      return res.status(400).json({ message: "User already exists" });

    const user = await User.create({ name, email, password });

    // set cookie
    const token = generateToken(res, user._id);

    res.status(201).json({
      message: "Registration successful",
      _id: user._id,
      name: user.name,
      email: user.email,
      token,
    });
  } catch (error) {
    res.status(400).json({ message: "Invalid user data", error: error.message });
  }
};

// ==============================
// LOGIN USER
// ==============================
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      generateToken(res, user._id);

      return res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
      });
    }

    res.status(401).json({ message: "Invalid email or password" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// ==============================
// GET USER PROFILE + ORDERS
// ==============================
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    const orders = await Order.find({ user: req.user.id }).sort({
      createdAt: -1,
    });

    res.json({ ...user.toObject(), orders });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ==============================
// UPDATE ADDRESS (Add/Edit/Delete)
// ==============================
export const updateAddress = async (req, res) => {
  try {
    const { action, address } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) return res.status(404).json({ message: "User not found" });

    if (!Array.isArray(user.addresses)) user.addresses = [];

    switch (action) {
      case "add":
        user.addresses.push(address);
        break;

      case "edit":
        if (!address._id)
          return res.status(400).json({ message: "Address ID required" });

        user.addresses = user.addresses.map((addr) =>
          addr._id.toString() === address._id
            ? { ...addr.toObject(), ...address }
            : addr
        );
        break;

      case "delete":
        if (!address._id)
          return res.status(400).json({ message: "Address ID required" });

        user.addresses = user.addresses.filter(
          (addr) => addr._id.toString() !== address._id
        );
        break;

      default:
        return res.status(400).json({ message: "Invalid action" });
    }

    await user.save();
    res.json({
      message: "Address updated successfully",
      addresses: user.addresses,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ==============================
// CHANGE PASSWORD
// ==============================
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
    res.status(500).json({ message: "Server error" });
  }
};
