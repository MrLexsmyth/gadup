"use client";

import { useEffect, useState } from "react";
import API from "../../../../lib/api"; // <-- adjust path if needed
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";

interface StatType {
  totalIncome: number;
  ordersCount: number;
}

interface StatsResponse {
  dailyIncome: StatType;
  weeklyIncome: StatType;
  monthlyIncome: { _id: { month: number }; totalIncome: number; ordersCount: number }[];
  yearlyIncome: { _id: { year: number }; totalIncome: number; ordersCount: number }[];
}

interface DailyRevenue {
  _id: { day: number; month: number };
  totalIncome: number;
}

interface ProductStat {
  _id: string; // product name or ID
  totalSold: number;
}

interface PaymentStats {
  successRate: number;
}


export default function IncomeStats() {
  const [stats, setStats] = useState<StatsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [dailyData, setDailyData] = useState<{ name: string; income: number }[]>([]);
  const [products, setProducts] = useState<ProductStat[]>([]);
  const [paymentStats, setPaymentStats] = useState<PaymentStats | null>(null);


  // Fetch main income stats
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await API.get("/admin/income-stats");
        setStats(res.data);
      } catch (error) {
        console.error("Error loading income stats", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  // Fetch daily chart data, top products, and payment stats
 useEffect(() => {
  const loadData = async () => {
    try {
      const daily = await API.get<DailyRevenue[]>("/admin/daily-revenue");
      const productStats = await API.get<ProductStat[]>("/admin/top-products");
      const payment = await API.get<PaymentStats>("/admin/payment-success");

      setDailyData(
        daily.data.map((d) => ({
          name: `${d._id.day}/${d._id.month}`,
          income: d.totalIncome,
        }))
      );

      setProducts(productStats.data);
      setPaymentStats(payment.data);
    } catch (error) {
      console.log("Error loading analytics", error);
    }
  };

  loadData();
}, []);


  if (loading) return <p className="text-center p-4">Loading income stats...</p>;
  if (!stats) return <p className="text-center text-red-500 p-4">No stats available.</p>;

  return (
    <div className="w-full p-4 space-y-8">
      {/* Overview Cards */}
      <h1 className="text-2xl font-semibold text-gray-800 mb-4">Overview</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card
          title="Today's Income"
          amount={stats.dailyIncome.totalIncome}
          orders={stats.dailyIncome.ordersCount}
        />
        <Card
          title="This Week"
          amount={stats.weeklyIncome.totalIncome}
          orders={stats.weeklyIncome.ordersCount}
        />
        <Card
          title="This Month"
          amount={stats.monthlyIncome.reduce((acc, m) => acc + m.totalIncome, 0)}
          orders={stats.monthlyIncome.reduce((acc, m) => acc + m.ordersCount, 0)}
        />
        <Card
          title="This Year"
          amount={stats.yearlyIncome.reduce((acc, y) => acc + y.totalIncome, 0)}
          orders={stats.yearlyIncome.reduce((acc, y) => acc + y.ordersCount, 0)}
        />
      </div>

      {/* Daily Income Chart */}
      <div className="p-6 bg-white  rounded-xl shadow-md">
        <h2 className="font-bold mb-4 text-lg">Daily Income (30 days)</h2>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={dailyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip formatter={(value: number) => `₦${value.toLocaleString()}`} />
            <Line type="monotone" dataKey="income" stroke="#008080" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Top Selling Products */}
      <div className="p-6 bg-white  rounded-xl shadow-md">
        <h2 className="font-bold mb-4 text-lg">Top Selling Products</h2>
        <ul className="space-y-2">
          {products.map((p) => (
            <li key={p._id} className="flex justify-between">
              <span>{p._id}</span>
              <span className="font-semibold">{p.totalSold} sold</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Payment Success Rate */}
      <div className="p-6 bg-white  rounded-xl shadow-md text-center">
        <h2 className="font-bold mb-3 text-lg">Payment Success Rate</h2>
        {paymentStats && (
          <p className="text-3xl font-bold">
            {paymentStats.successRate}% <span className="text-sm font-normal">successful</span>
          </p>
        )}
      </div>
    </div>
  );
}

function Card({
  title,
  amount,
  orders,
}: {
  title: string;
  amount: number;
  orders: number;
}) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-md border dark:border-gray-700 transition hover:shadow-lg">
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-2xl font-bold mb-1">
        {amount.toLocaleString("en-NG", { style: "currency", currency: "NGN" })}
      </p>
      <span className="text-sm text-gray-500 dark:text-gray-400">{orders} orders</span>
    </div>
  );
}
