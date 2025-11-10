import Order from "../models/Order.js";


export const createOrder = async (req, res) => {
  try {

    const { items, total, paymentMethod = "Paystack", address, userName, userEmail } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    const order = new Order({
      user: req.user.id,
      items,
      total,
      paymentMethod,
      address,
      userName,
      userEmail,
      status: "pending", // you can later update to "paid" if you integrate payment
      createdAt: new Date(),
    });

    await order.save();

    res.status(201).json({ message: "Order placed successfully", order });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
