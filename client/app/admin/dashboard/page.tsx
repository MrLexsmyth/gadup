"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import API from "../../../lib/api"; // use centralized axios instance

export default function Dashboard() {
  const [user, setUser] = useState<{ name?: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchAdmin = async () => {
      try {
        const { data } = await API.get("/admin/dashboard");

        // if user not authenticated, redirect
        if (!data || (!data.user && !data.admin)) {
          router.push("/admin/login");
          return;
        }

        setUser(data.user || data.admin || null);
      } catch (error) {
        console.error("Error fetching admin:", error);
        router.push("/admin/login");
      } finally {
        setLoading(false);
      }
    };

    fetchAdmin();
  }, [router]);

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600 text-lg">Loading dashboard...</p>
      </div>
    );

  if (!user)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600 text-lg">Redirecting to login...</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-8">
      <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Welcome, {user.name}
        </h1>
        <p className="text-gray-600 mb-6">You are logged in as an Admin 🎉</p>

        <button
          onClick={async () => {
            await API.post("/auth/logout"); // logout via centralized API
            router.push("/admin/login");
          }}
          className="bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700 transition"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
