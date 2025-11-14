import axios from "axios";
import Order from "../models/Order.js";

// POST /api/payment/verify
export const verifyPayment = async (req, res) => {
  try {
    const { reference, items, total, address, userName, userEmail } = req.body;

    if (!req.user?.id) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    if (!reference) {
      return res.status(400).json({ message: "Payment reference is required" });
    }

    if (!items || !total || !address || !userName || !userEmail) {
      return res.status(400).json({ message: "Incomplete payment/order data" });
    }

    // Verify payment with Paystack
    const response = await axios.get(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}` },
      }
    );

    const data = response.data;

    if (!data || !data.status || !data.data) {
      return res.status(400).json({ message: "Invalid Paystack response" });
    }

    if (data.status && data.data.status === "success") {
      const order = new Order({
        user: req.user.id,
        items,
        total,
        paymentMethod: "Paystack",
        address,
        userName,
        userEmail,
        status: "paid",
        reference,
        createdAt: new Date(),
      });

      await order.save();

      return res.status(201).json({
        message: "Payment verified and order placed",
        order,
      });
    } else {
      return res.status(400).json({ message: "Payment not successful" });
    }
  } catch (error) {
    console.error("VerifyPayment error:", error.response?.data || error.message);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};
