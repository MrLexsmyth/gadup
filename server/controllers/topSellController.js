import Order from "../models/Order.js";


    export const dailyRevenue = async (req, res) => {

        const last30Days = new Date();
           last30Days.setDate(last30Days.getDate() - 30);

  try {
    const stats = await Order.aggregate([
      { $match: { createdAt: { $gte: last30Days } } },
      {
        $group: {
          _id: { day: { $dayOfMonth: "$createdAt" }, month: { $month: "$createdAt" } },
          totalIncome: { $sum: "$total" },
        },
      },
      { $sort: { "_id.month": 1, "_id.day": 1 } },
    ]);

    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: "Daily revenue error" });
  }
};

// Top Selling Products

export const topProduct = async (req, res) => {
  try {
    const stats = await Order.aggregate([
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.name",
          totalSold: { $sum: "$items.quantity" },
        },
      },
      { $sort: { totalSold: -1 } },
      { $limit: 5 },
    ]);

    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: "Top product stats error" });
  }
};

//  Payment Success Rate

export const paymentSuccess = async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const successfulPayments = await Order.countDocuments({ status: "paid" });

    const successRate = totalOrders === 0 ? 0 : (successfulPayments / totalOrders) * 100;

    res.json({
      totalOrders,
      successfulPayments,
      successRate: successRate.toFixed(2),
    });
  } catch {
    res.status(500).json({ error: "Payment success analysis error" });
  }
};