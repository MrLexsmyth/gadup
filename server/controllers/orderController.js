import axios from "axios";
import Order from "../models/Order.js";
import Product from "../models/Product.js";

// POST /api/payment/verify
export const verifyPayment = async (req, res) => {
  try {
    const { reference, items, address, userName, userEmail } = req.body;

    if (!req.user?.id) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    if (!reference) {
      return res.status(400).json({ message: "Payment reference is required" });
    }

    if (!items || !address || !userName || !userEmail) {
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
      // Fetch product info from DB to get discountPrice
      const productIds = items.map((item) => item._id);
      const products = await Product.find({ _id: { $in: productIds } });

      // Map items with discount logic
      const orderItems = items.map((item) => {
        const product = products.find((p) => p._id.toString() === item._id);
        const priceToUse = product.discountPrice > 0 ? product.discountPrice : product.price;

      return {
  _id: product._id,
  name: product.name,
  price: priceToUse,
  quantity: item.quantity,
  image: { url: product.images?.[0]?.url || "" },
  discountPrice: product.discountPrice,
  discountPercentage: product.discountPercentage,
};

      });

      // 🔥 REDUCE STOCK FOR EACH PRODUCT ORDERED
      for (const item of items) {
        const product = await Product.findById(item._id);

        if (!product)
          return res.status(404).json({ message: "Some products no longer exist" });

        if (product.stock < item.quantity)
          return res.status(400).json({
            message: `${product.name} does not have enough stock`,
          });

        product.stock -= item.quantity;
        await product.save();
      }

      // Calculate total
      const total = orderItems.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
      );

      // Create order
      const order = new Order({
        user: req.user.id,
        items: orderItems,
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
        message: "Payment verified, stock updated, and order placed",
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
