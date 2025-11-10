"use client";

import { useState } from "react";
import { changeAdminPassword } from "../../../services/adminService";
import { AxiosError } from "axios";

function isAxiosError(error: unknown): error is AxiosError<{ message: string }> {
  return (
    typeof error === "object" &&
    error !== null &&
    "isAxiosError" in error &&
    (error as AxiosError).isAxiosError === true
  );
}

export default function ChangePassword() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const res = await changeAdminPassword(currentPassword, newPassword);
      setMessage(res.message);
      setCurrentPassword("");
      setNewPassword("");
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        setMessage(error.response?.data?.message || "Server error");
      } else if (error instanceof Error) {
        setMessage(error.message);
      } else {
        setMessage("Unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Change Password
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Current Password
          </label>
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-gray-400"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            New Password
          </label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-gray-400"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full p-2 rounded-md text-white ${
            loading
              ? "bg-gray-500 cursor-not-allowed"
              : "bg-gray-900 hover:bg-gray-800 transition"
          }`}
        >
          {loading ? "Changing..." : "Change Password"}
        </button>
      </form>

      {message && (
        <p
          className={`mt-4 text-sm text-center ${
            message.toLowerCase().includes("success")
              ? "text-green-600"
              : "text-red-500"
          }`}
        >
          {message}
        </p>
      )}
    </div>
  );
}
