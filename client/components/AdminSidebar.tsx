"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, Variants } from "framer-motion";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  Settings,
  X,
  Menu,
} from "lucide-react";

const menuItems = [
  { name: "Dashboard", icon: <LayoutDashboard size={20} />, path: "/admin/dashboard" },
  { name: "Products", icon: <Package size={20} />, path: "/admin/dashboard/products" },
  { name: "Orders", icon: <ShoppingBag size={20} />, path: "/admin/dashboard/orders" },
  { name: "Users", icon: <Users size={20} />, path: "/admin/users" },
  { name: "Settings", icon: <Settings size={20} />, path: "/admin/settings" },
];

const now = new Date();
const day = now.getDate();
const ordinal = (d: number) => {
  if (d > 3 && d < 21) return "th";
  switch (d % 10) {
    case 1: return "st";
    case 2: return "nd";
    case 3: return "rd";
    default: return "th";
  }
};
const formattedDate = `${day}${ordinal(day)} ${now.toLocaleString("en-GB", {
  month: "long",
  year: "numeric",
  hour12: true,
})}`;

// Sidebar animation
const sidebarVariants: Variants = {
  hidden: { x: -300 },
  visible: {
    x: 0,
    transition: { type: "spring", stiffness: 200, damping: 30 },
  },
};

// Menu item animation
const itemVariants: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0 },
};

export default function AdminSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile screen
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
  
      {isMobile && (
        <button
          className="fixed top-4 left-4 z-50 bg-gray-900 text-white p-2 rounded-md"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      )}

     
      <motion.aside
        className="h-screen w-64 bg-gray-900 text-gray-100 flex flex-col justify-between shadow-lg fixed left-0 top-0 p-5 z-40 md:static md:translate-x-0"
        variants={sidebarVariants}
        initial="hidden"
        animate={isMobile ? (isOpen ? "visible" : "hidden") : "visible"}
      >
      
        <div>
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-white">Hi, Admin</h1>
            <p className="text-gray-400 text-sm">Welcome to your dashboard!</p>
            <p className="text-gray-500 text-xs mt-1">{formattedDate}</p>
          </div>

        
          <motion.nav
            className="flex flex-col gap-2"
            variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
            initial="hidden"
            animate="visible"
          >
            {menuItems.map(({ path, icon, name }) => (
              <motion.div key={path} variants={itemVariants}>
                <Link
                  href={path}
                  onClick={() => {
                    if (isMobile) setIsOpen(false); // close sidebar on mobile
                  }}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-800 transition-colors duration-200 group"
                >
                  <span className="text-gray-400 group-hover:text-white">{icon}</span>
                  <span className="text-sm font-medium group-hover:text-white">{name}</span>
                </Link>
              </motion.div>
            ))}
          </motion.nav>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-700 pt-4 mt-6 text-center text-xs text-gray-500">
          © {new Date().getFullYear()} GadUp
        </div>
      </motion.aside>
    </>
  );
}
