"use client";

import { useEffect, useState } from "react";
import API from "@/lib/api";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

interface Address {
  _id?: string;
  label: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

interface Item {
  _id: string;
  name: string;
  price: number;
  quantity: number;
  image?: { url: string };
}

interface Order {
  _id: string;
  total: number;
  createdAt: string;
  status: string;
  address: Address;
  items: Item[];
}

interface User {
  _id: string;
  name: string;
  email: string;
  addresses: Address[];
  orders?: Order[];
}

export default function UserProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"profile" | "address" | "orders">(
    "profile"
  );
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const { data } = await API.get("/user/profile");
        setUser(data);
      } catch (err) {
        console.error("❌ Failed to fetch profile:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  if (loading) return <p className="p-6">Loading profile...</p>;
  if (!user) return <p className="p-6 text-red-500">Failed to load profile.</p>;

  return (
    <div className="max-w-6xl mx-auto p-6 grid grid-cols-1 md:grid-cols-4 gap-6">
      {/* ---------- Left Sidebar ---------- */}
      <aside className="md:col-span-1 border rounded-lg p-4 shadow-sm bg-white">
        <h2 className="text-lg font-semibold mb-4 text-gray-800">Account</h2>
        <ul className="space-y-2">
          <li>
            <button
              onClick={() => setActiveTab("profile")}
              className={`w-full text-left p-2 rounded-md transition ${
                activeTab === "profile"
                  ? "bg-blue-600 text-white"
                  : "hover:bg-gray-100 text-gray-800"
              }`}
            >
              My Profile
            </button>
          </li>
          <li>
            <button
              onClick={() => setActiveTab("address")}
              className={`w-full text-left p-2 rounded-md transition ${
                activeTab === "address"
                  ? "bg-blue-600 text-white"
                  : "hover:bg-gray-100 text-gray-800"
              }`}
            >
              Address Book
            </button>
          </li>
          <li>
            <button
              onClick={() => setActiveTab("orders")}
              className={`w-full text-left p-2 rounded-md transition ${
                activeTab === "orders"
                  ? "bg-blue-600 text-white"
                  : "hover:bg-gray-100 text-gray-800"
              }`}
            >
              My Orders
            </button>
          </li>
        </ul>
      </aside>

      {/* ---------- Right Content Area ---------- */}
      <section className="md:col-span-3 bg-white border rounded-lg shadow-sm p-6 min-h-[400px]">
        <AnimatePresence mode="wait">
          {activeTab === "profile" && (
            <motion.div
              key="profile"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
            >
              <h1 className="text-2xl font-bold mb-4">My Profile</h1>
              <div className="space-y-2">
                <p>
                  <strong>Name:</strong> {user.name}
                </p>
                <p>
                  <strong>Email:</strong> {user.email}
                </p>
              </div>
            </motion.div>
          )}

          {activeTab === "address" && (
            <motion.div
              key="address"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
            >
              <h1 className="text-2xl font-bold mb-4">My Address Book</h1>
              {user.addresses.length === 0 ? (
                <p className="text-gray-600">No addresses saved.</p>
              ) : (
                <div className="space-y-4">
                  {user.addresses.map((addr) => (
                    <div
                      key={addr._id}
                      className="border border-gray-200 p-4 rounded-lg shadow-sm hover:shadow-md transition"
                    >
                      <p className="font-semibold text-gray-800">{addr.label}</p>
                      <p className="text-sm text-gray-600">{addr.line1}</p>
                      {addr.line2 && (
                        <p className="text-sm text-gray-600">{addr.line2}</p>
                      )}
                      <p className="text-sm text-gray-600">
                        {addr.city}, {addr.state}
                      </p>
                      <p className="text-sm text-gray-600">
                        {addr.postalCode}, {addr.country}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {activeTab === "orders" && (
            <motion.div
              key="orders"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
            >
              <h1 className="text-2xl font-bold mb-4">Order History</h1>
              {user.orders && user.orders.length > 0 ? (
                <div className="space-y-4">
                  {user.orders.map((order) => (
                    <div
                      key={order._id}
                      className="border border-gray-200 p-4 rounded-lg shadow-sm hover:shadow-md transition"
                    >
                      <div
                        className="flex justify-between items-center cursor-pointer"
                        onClick={() =>
                          setExpandedOrder(
                            expandedOrder === order._id ? null : order._id
                          )
                        }
                      >
                        <p>
                          <strong>Order ID:</strong> {order._id}
                        </p>
                        <p>
                          <strong>Total:</strong> ₦{order.total.toLocaleString()}
                        </p>
                        <p>
                          <strong>Status:</strong>{" "}
                          <span
                            className={`${
                              order.status === "delivered"
                                ? "text-green-600"
                                : order.status === "pending"
                                ? "text-yellow-600"
                                : "text-gray-600"
                            } font-medium`}
                          >
                            {order.status}
                          </span>
                        </p>
                      </div>

                      {/* Expanded order details */}
                      {expandedOrder === order._id && (
                        <div className="mt-4 space-y-3">
                          <p>
                            <strong>Date:</strong>{" "}
                            {new Date(order.createdAt).toLocaleString()}
                          </p>

                          <div>
                            <strong>Shipping Address:</strong>
                            <p>
                              {order.address.label && `${order.address.label}: `}
                              {order.address.line1}
                              {order.address.line2 && `, ${order.address.line2}`},{" "}
                              {order.address.city}, {order.address.state}{" "}
                              {order.address.postalCode}, {order.address.country}
                            </p>
                          </div>

                          <div>
                            <strong>Items:</strong>
                            <div className="space-y-2 mt-2">
                              {order.items.map((item, i) => (
                                <div
                                  key={i}
                                  className="flex items-center gap-4 border p-2 rounded"
                                >
                                  {item.image?.url && (
                                    <div className="w-16 h-16 relative flex-shrink-0">
                                      <Image
                                        src={item.image.url}
                                        alt={item.name}
                                        fill
                                        className="object-cover rounded"
                                      />
                                    </div>
                                  )}
                                  <div>
                                    <p className="font-medium">{item.name}</p>
                                    <p>
                                      Qty: {item.quantity} × ₦
                                      {item.price.toLocaleString()}
                                    </p>
                                    <p>
                                      Subtotal: ₦
                                      {(item.quantity * item.price).toLocaleString()}
                                    </p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600">You haven’t made any orders yet.</p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </div>
  );
}
