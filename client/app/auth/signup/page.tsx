"use client";
import { toast } from "react-hot-toast";
import { Playfair_Display } from "next/font/google";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signupUser } from "../../../services/authService";
import { AxiosError } from "axios";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react"; 
import { signIn } from "next-auth/react";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

// Helper: returns list of password errors
const getPasswordErrors = (password: string) => {
  return [
    { test: password.length >= 8, message: "At least 8 characters" },
    { test: /[A-Z]/.test(password), message: "One uppercase letter" },
    { test: /\d/.test(password), message: "One number" },
  ];
};

export default function SignupPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false); 

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Frontend validation
    if (!form.name || form.name.length < 2) {
      setError("Name must be at least 2 characters");
      setLoading(false);
      return;
    }

    const pwdErrors = getPasswordErrors(form.password)
      .filter(err => !err.test)
      .map(err => err.message);

    if (pwdErrors.length > 0) {
      setError("Password must have: " + pwdErrors.join(", "));
      setLoading(false);
      return;
    }

    try {
      await signupUser(form);
      toast.success(" Signup successful!");
      router.push("/auth/login");
    } catch (err: unknown) {
      const error = err as AxiosError<{ message: string }>;
      setError(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const passwordErrors = getPasswordErrors(form.password);

  return (
    <div className={`min-h-screen flex flex-col md:flex-row ${playfair.className}`}>
      <div className="hidden md:flex flex-1 relative">
        <Image src="/signup.jpg" alt="Sign Up Image" fill className="object-cover" priority />
      </div>

      <div className="flex-1 flex justify-center items-center md:p-6 bg-gradient-to-b from-gray-50 to-white">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md md:px-2 bg-white md:bg-transparent shadow-sm md:shadow-none rounded-lg md:rounded-none p-6 md:p-0"
        >
          <div className="flex flex-col justify-center items-center mb-6">
            <Image src="/bagg.webp" alt="Sign Up Image" width={90} height={90} className="object-contain" priority />
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mt-4">Ready to Gear Up?</h2>
            <p className="text-gray-600 text-sm md:text-base text-center mt-2 px-3">
              Join now to explore the latest tech trends, enjoy exclusive offers, and stay ahead with the hottest gadgets on the market.
            </p>
          </div>

          {error && <p className="text-red-600 mb-4 text-center">{error}</p>}

          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="UserName"
            required
            className="w-full p-3 border-b border-gray-400 mb-4 focus:outline-none focus:border-[#00817c]"
          />

          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email"
            required
            className="w-full p-3 border-b border-gray-400 mb-4 focus:outline-none focus:border-[#00817c]"
          />

          
          <div className="relative w-full mb-2">
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
              className="absolute cursor-pointer right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

         
          <div className="text-sm text-gray-600 mb-4">
            {passwordErrors.map((err, idx) => (
              <p key={idx} className={err.test ? "text-green-600" : "text-gray-600"}>
                • {err.message}
              </p>
            ))}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#00817c] text-white py-3 rounded cursor-pointer transition hover:bg-[#006c65] mb-4"
          >
            {loading ? "Signing up..." : "Create Account"}
          </button>

          <button
            type="button"
            onClick={async () => {
              setGoogleLoading(true); 
              try {
                await signIn("google", { callbackUrl: "/dashboard" }); 
              } finally {
                setGoogleLoading(false); 
              }
            }}
            className={`w-full flex items-center justify-center gap-3 bg-white text-gray-700 border border-gray-300 py-3 rounded mb-4 cursor-pointer transition hover:bg-gray-100 shadow-sm ${
              googleLoading ? "opacity-70 cursor-not-allowed" : ""
            }`}
            disabled={googleLoading}
          >
            <Image src="/google.png" alt="Google logo" width={18} height={18} className="object-contain" />
            <span className="text-[#00817c] font-medium">
              {googleLoading ? "Redirecting..." : "Sign up with Google"}
            </span>
          </button>

          <h2 className="text-center text-gray-700 text-sm md:text-base">
            Already have an account?{" "}
            <Link href="/auth/login" className="text-[#00817c] hover:underline font-medium">Log in</Link>
          </h2>
        </form>
      </div>
    </div>
  );
}
