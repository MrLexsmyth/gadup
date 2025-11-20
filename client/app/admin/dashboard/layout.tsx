"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import AdminSidebar from "../../../components/AdminSidebar";
import { useRouter } from "next/navigation";
import API from "../../../lib/api"; 
import { Playfair_Display } from "next/font/google"; 

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});



export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState<number | null>(null);
  const [adminName, setAdminName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Track window width
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Fetch admin info
  useEffect(() => {
    const fetchAdmin = async () => {
      try {
        const { data } = await API.get("/admin/me");

        if (!data || !data.name) {
          router.push("/admin/login");
          return;
        }

        setAdminName(data.name);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch admin:", error);
        router.push("/admin/login");
      }
    };

    fetchAdmin();
  }, [router]);

  if (windowWidth === null || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 text-gray-600">
        Loading...
      </div>
    );
  }

  const showSidebar = sidebarOpen || windowWidth > 768;

  return (
   <div className={`flex min-h-screen bg-gray-100 ${playfair.className}`}>

      <AnimatePresence>
        {showSidebar && (
          <motion.aside
            className="fixed md:relative z-40 text-white w-64 h-full shadow-lg"
            initial={{ x: -260 }}
            animate={{ x: 0 }}
            exit={{ x: -260 }}
            transition={{ type: "spring", stiffness: 260, damping: 25 }}
          >
            <AdminSidebar />
          </motion.aside>
        )}
      </AnimatePresence>

     <div className="flex-1 flex flex-col max-h-screen">
  
    <header className=" fixed w-[1280] flex items-center justify-between bg-white shadow px-4 py-3 md:px-6">
    <div className="flex items-center gap-2">
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="md:hidden p-2 rounded-md border border-gray-300 hover:bg-gray-200 transition"
      >
        {sidebarOpen ? "✖" : "☰"}
      </button>
      <h1 className="text-lg font-semibold text-gray-700">Dashboard</h1>
    </div>

    <div className="flex items-center gap-3">
      {adminName ? (
        <div className="hidden md:block text-gray-700 text-sm font-medium">
          Welcome back, <span className="font-semibold">{adminName}</span>
        </div>
      ) : (
        <div className="text-gray-400 text-sm">Admin</div>
      )}
    </div>
  </header>

  <main className="flex-1 mt-[64px] p-4 md:p-6 overflow-y-auto">
    {children}
  </main>
</div>

    </div>
  );
}
