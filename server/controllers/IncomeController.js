import Order from "../models/Order.js";


// Helper function to convert date to start of day
const startOfDay = (date) => {
  date.setHours(0, 0, 0, 0);
  return date;
};

export const getIncomeStats = async (req, res) => {
  try {
    const today = startOfDay(new Date());
    const weekAgo = new Date();
    weekAgo.setDate(today.getDate() - 7);
    const monthAgo = new Date();
    monthAgo.setMonth(today.getMonth() - 1);
    const yearAgo = new Date();
    yearAgo.setFullYear(today.getFullYear() - 1);

    //  DAILY INCOME
    const dailyIncome = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: today },
          status: "paid" // Only include paid orders
        }
      },
      {
        $group: {
          _id: null,
          totalIncome: { $sum: "$total" },
          ordersCount: { $sum: 1 }
        }
      }
    ]);

    //  WEEKLY INCOME
    const weeklyIncome = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: weekAgo },
          status: "paid"
        }
      },
      {
        $group: {
          _id: null,
          totalIncome: { $sum: "$total" },
          ordersCount: { $sum: 1 }
        }
      }
    ]);

    //  MONTHLY INCOME (Grouped by month)
    const monthlyIncome = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: monthAgo },
          status: "paid"
        }
      },
      {
        $group: {
          _id: { month: { $month: "$createdAt" } },
          totalIncome: { $sum: "$total" },
          ordersCount: { $sum: 1 }
        }
      },
      { $sort: { "_id.month": 1 } }
    ]);

    //  YEARLY INCOME (Grouped by year)
    const yearlyIncome = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: yearAgo },
          status: "paid"
        }
      },
      {
        $group: {
          _id: { year: { $year: "$createdAt" } },
          totalIncome: { $sum: "$total" },
          ordersCount: { $sum: 1 }
        }
      },
      { $sort: { "_id.year": 1 } }
    ]);

    return res.json({
      dailyIncome: dailyIncome[0] || { totalIncome: 0, ordersCount: 0 },
      weeklyIncome: weeklyIncome[0] || { totalIncome: 0, ordersCount: 0 },
      monthlyIncome,
      yearlyIncome
    });

  } catch (error) {
    console.error("Income Stats Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};
