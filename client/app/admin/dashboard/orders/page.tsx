"use client";

import { useEffect, useState } from "react";
import API from "../../../..//lib/api";
import Image from "next/image";
import { toast } from "react-hot-toast";
import { AxiosError } from "axios";




interface User {
  _id: string;
  name: string;
  email: string;
}

interface Address {
  label: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

interface OrderItem {
  _id: string;
  name: string;
  price: number;
  quantity: number;
  image?: { url: string };
}

interface Order {
  _id: string;
  user: User;
  items: OrderItem[];
  total: number;
  paymentMethod: string;
  status: string;
  address: Address;
  userName: string;
  userEmail: string;
  reference: string;
  createdAt: string;
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const { data } = await API.get<Order[]>("/admin/orders");
      setOrders(data);
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        console.error(error.response?.data || error.message);
        toast.error(error.response?.data?.message || "Failed to fetch orders");
      } else if (error instanceof Error) {
        console.error(error.message);
        toast.error(error.message);
      } else {
        console.error(error);
        toast.error("An unknown error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (orderId: string, status: string) => {
    try {
      const { data } = await API.put(`/admin/orders/${orderId}/status`, { status });
      toast.success(data.message);
      setOrders((prev) =>
        prev.map((order) => (order._id === orderId ? { ...order, status } : order))
      );
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        console.error(error.response?.data || error.message);
        toast.error(error.response?.data?.message || "Failed to update status");
      } else if (error instanceof Error) {
        console.error(error.message);
        toast.error(error.message);
      } else {
        console.error(error);
        toast.error("An unknown error occurred");
      }
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading) return <p className="text-center mt-10">Loading orders...</p>;

  return (
    <div className="max-w-7xl mx-auto p-4">
      <h1 className="text-3xl font-semibold mb-6">All Orders</h1>
      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <div className="flex flex-col gap-4">
          {orders.map((order) => (
            <div key={order._id} className="border p-4 rounded shadow-sm">
              <div className="flex justify-between items-center mb-2">
                <div>
                  <p className="font-semibold">{order.userName} ({order.user?.email || "No email"})</p>

                  <p className="text-sm text-gray-600">{new Date(order.createdAt).toLocaleString()}</p>
                  <p className="text-sm text-gray-600">Payment: {order.paymentMethod}</p>
                </div>
                <div>
                  <select
                    value={order.status}
                    onChange={(e) => updateStatus(order._id, e.target.value)}
                    className="border p-1 rounded"
                  >
                    <option value="paid">Paid</option>
                    <option value="pending">Pending</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {order.items.map((item) => (
                  <div key={item._id} className="flex items-center gap-2">
                    {item.image?.url && (
                      <div className="relative w-14 h-10 sm:h-10 md:h-12 lg:h-12">
                             <Image src={item.image.url} alt={item.name} fill className="object-cover object-center" />
                           </div>
                    )}
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm">₦{item.price.toLocaleString()} × {item.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>
              <p className="mt-2 font-semibold">Total: ₦{order.total.toLocaleString()}</p>
              <div className="mt-2 text-sm text-gray-600">
                <p>Shipping to: {order.address.line1}, {order.address.city}, {order.address.state}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
