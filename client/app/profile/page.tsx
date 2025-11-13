"use client";

import { useEffect, useState } from "react";
import API from "@/lib/api";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

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
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const { data } = await API.get("/user/profile");
        setUser(data);
      } catch (err) {
        console.error(" Failed to fetch profile:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  if (loading) return <p className="p-6">Loading profile...</p>;
  if (!user) return <p className="p-6 text-red-500">Failed to load profile.</p>;

  return (
    <div
      className="max-w-6xl mx-auto p-6 grid grid-cols-1 md:grid-cols-4 gap-6"
      style={{ fontFamily: "Playfair Display, serif" }}
    >
      {/* ---------- Left Sidebar ---------- */}
      <aside className="md:col-span-1 border rounded-lg p-4 shadow-sm bg-white">
        <h2 className="text-lg font-semibold mb-4 text-gray-800">Account</h2>
        <ul className="space-y-2">
          <li>
            <button
              onClick={() => setActiveTab("profile")}
              className={`w-full text-left p-2 rounded-md transition cursor-pointer ${
                activeTab === "profile"
                  ? "bg-[#008080] text-white"
                  : "hover:bg-gray-100 text-gray-800"
              }`}
            >
              My Profile
            </button>
          </li>
          <li>
            <button
              onClick={() => setActiveTab("address")}
              className={`w-full text-left p-2 rounded-md transition cursor-pointer ${
                activeTab === "address"
                  ? "bg-[#008080] text-white"
                  : "hover:bg-gray-100 text-gray-800"
              }`}
            >
              Address Book
            </button>
          </li>
          <li>
            <button
              onClick={() => setActiveTab("orders")}
              className={`w-full text-left p-2 rounded-md transition cursor-pointer ${
                activeTab === "orders"
                  ? "bg-[#008080] text-white"
                  : "hover:bg-gray-100 text-gray-800"
              }`}
            >
              My Orders
            </button>
          </li>
          
             <Link href="/profile/password">
                <button className="w-full text-left p-2 rounded-md  text-black transition cursor-pointer hover:bg-gray-100 text-gray-800">
                  Change Password
                </button>
              </Link>
        
        </ul>
        
       
      
      </aside>
      

      {/* ---------- Right Content Area ---------- */}
      <section className="md:col-span-3 bg-white border border-[#008080] rounded-lg shadow-sm p-6 min-h-[400px]">
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
                  <strong>Username:</strong> {user.name}
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
              <Link href="/profile/addresses">
                <button className="bg-[#008080] text-white font-semibold mt-4 py-2 px-4 cursor-pointer rounded hover:bg-gray-700 transition-colors duration-300">
                  Add / Delete Address
                </button>
              </Link>
              
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
                      className="border border-gray-200 p-4 rounded-lg shadow-sm hover:shadow-md transition cursor-pointer"
                      onClick={() => setSelectedOrder(order)}
                    >
                      <div className="flex justify-between items-center">
                        <p>
                          <strong>Order ID:</strong> {order._id}
                        </p>
                        <p>
                          <strong>Total:</strong> ₦
                          {order.total.toLocaleString()}
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

      {/* ---------- Modal for Order Details ---------- */}
      <AnimatePresence>
        {selectedOrder && (
          <motion.div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white p-6 rounded-lg shadow-xl max-w-2xl w-full relative overflow-y-auto max-h-[90vh]"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <button
                onClick={() => setSelectedOrder(null)}
                className="absolute top-3 right-4 text-gray-600 hover:text-red-500 text-lg font-bold"
              >
                ✕
              </button>
              <h2 className="text-2xl font-bold mb-4">
                Order Details - #{selectedOrder._id}
              </h2>
              <p>
                <strong>Date:</strong>{" "}
                {new Date(selectedOrder.createdAt).toLocaleString()}
              </p>
              <p>
                <strong>Status:</strong>{" "}
                <span
                  className={`${
                    selectedOrder.status === "delivered"
                      ? "text-green-600"
                      : selectedOrder.status === "pending"
                      ? "text-yellow-600"
                      : "text-gray-600"
                  } font-medium`}
                >
                  {selectedOrder.status}
                </span>
              </p>
              <p className="mt-2">
                <strong>Total:</strong> ₦
                {selectedOrder.total.toLocaleString()}
              </p>

              <div className="mt-4">
                <strong>Shipping Address:</strong>
                <p className="text-sm text-gray-700">
                  {selectedOrder.address.label && `${selectedOrder.address.label}: `}
                  {selectedOrder.address.line1}
                  {selectedOrder.address.line2 && `, ${selectedOrder.address.line2}`},{" "}
                  {selectedOrder.address.city}, {selectedOrder.address.state}{" "}
                  {selectedOrder.address.postalCode}, {selectedOrder.address.country}.
                </p>
              </div>

              <div className="mt-6">
                <strong>Items:</strong>
                <div className="space-y-2 mt-2">
                  {selectedOrder.items.map((item, i) => (
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
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
