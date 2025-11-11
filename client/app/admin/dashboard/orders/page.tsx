"use client";

import { useEffect, useState } from "react";
import API from "../../../../lib/api"; // centralized axios instance

interface Address {
  label?: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

interface Order {
  _id: string;
  user: { name: string; email: string };
  items: { name: string; price: number; quantity: number }[];
  total: number;
  status: string;
  createdAt: string;
  address: Address;
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await API.get<Order[]>("/admin/orders");
        setOrders(data);
      } catch (err) {
        console.error("Failed to fetch orders:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) return <p className="p-6">Loading orders...</p>;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">All Orders</h1>

      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order._id} className="border p-4 rounded shadow-sm">
              <p>
                <strong>User:</strong> {order.user.name} ({order.user.email})
              </p>
              <p>
                <strong>Total:</strong> ₦{order.total.toLocaleString()}
              </p>
              <p>
                <strong>Status:</strong> {order.status}
              </p>
              <p>
                <strong>Created At:</strong>{" "}
                {new Date(order.createdAt).toLocaleString()}
              </p>

              <div className="mt-2">
                <strong>Shipping Address:</strong>
                <p>
                  {order.address.label && `${order.address.label}: `}
                  {order.address.line1}
                  {order.address.line2 && `, ${order.address.line2}`},{" "}
                  {order.address.city}, {order.address.state}{" "}
                  {order.address.postalCode}, {order.address.country}
                </p>
              </div>

              <div className="mt-2">
                <strong>Items:</strong>
                <ul className="list-disc ml-6">
                  {order.items.map((item, i) => (
                    <li key={i}>
                      {item.name} × {item.quantity} — ₦{item.price.toLocaleString()}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
