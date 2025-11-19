"use client";

import { Playfair_Display } from "next/font/google";
import Image from "next/image";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { loginUser } from "../../../services/authService";
import { AxiosError } from "axios";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react"; 
import { useAuth } from "../../../context/AuthContext";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams?.get("redirect") || "/";
  const { refreshUser } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await loginUser(form);  
      await refreshUser();           
      router.push(redirect);          
    } catch (err: unknown) {
      const error = err as AxiosError<{ message: string }>;
      setError(error.response?.data?.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex flex-col md:flex-row ${playfair.className}`}>
      <div className="hidden md:flex flex-1 relative">
        <Image src="/login.jpg" alt="Log In Image" fill className="object-cover" priority />
      </div>

      <div className="flex-1 flex justify-center items-center md:p-6 bg-gradient-to-b from-gray-50 to-white">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md md:px-2 bg-white md:bg-transparent shadow-sm md:shadow-none rounded-lg md:rounded-none p-6 md:p-0"
        >
          <div className="flex flex-col justify-center items-center mb-6">
            <Image src="/bagg.webp" alt="Login" width={90} height={90} className="object-contain" priority />
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mt-4 mb-4">Welcome Back!</h2>
            <p className="text-gray-600 text-sm md:text-base text-center mt-2 px-3">
              Sign in to explore the latest tech trends and exclusive offers.
            </p>
          </div>

          {error && <p className="text-red-600 mb-4 text-center">{error}</p>}

          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email"
            required
            className="w-full p-3 border-b border-gray-400 mb-4 focus:outline-none focus:border-[#00817c]"
          />

          <div className="relative w-full mb-6">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Password"
              required
              className="w-full p-3 border-b border-gray-400 focus:outline-none focus:border-[#00817c] pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#00817c] text-white py-3 rounded cursor-pointer transition hover:bg-[#006c65] mb-4"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          <h2 className="text-center text-gray-700 text-sm md:text-base">
            Don&apos;t have an account?{" "}
            <Link href="/auth/signup" className="text-[#00817c] hover:underline font-medium">
              Register
            </Link>
          </h2>
        </form>
      </div>
    </div>
  );
}
