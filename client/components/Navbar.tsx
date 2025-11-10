"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "../context/CartContext";
import CartDrawer from "./CartDrawer";
import axios from "axios";
import { ShoppingCart, User, Menu, X, LogIn, UserPlus, LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const categories = [
  { name: "Home", link: "/" },
  { name: "Products", link: "/products/category" },
  { name: "About", link: "/about" },
  { name: "Contact", link: "/contacts" },
];

export default function Navbar() {
  const router = useRouter();
  const { cartCount, clearCart } = useCart();
  const { user, setUser } = useAuth();

  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [loadingUser, setLoadingUser] = useState(true);

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Load user from localStorage asynchronously
  useEffect(() => {
    if (typeof window === "undefined") return;
    const loadUser = () => {
      const storedUser = localStorage.getItem("user");
      if (storedUser) setUser(JSON.parse(storedUser));
      setLoadingUser(false);
    };
    const id = setTimeout(loadUser, 0);
    return () => clearTimeout(id);
  }, [setUser]);

  // Logout function
  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:5000/api/auth/logout", {}, { withCredentials: true });
      clearCart();
      localStorage.removeItem("user");
      setUser(null);
      router.push("/");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  // Render user menu (DRY)
  const renderUserMenu = () => {
    if (loadingUser) return null;

    if (!user) {
      return (
        <>
          <Link href="/auth/login">
            <button className="w-full cursor-pointer flex items-center gap-2 py-2 px-3 text-sm text-gray-700 font-medium rounded-lg hover:bg-gray-100  ">
              <LogIn /> Sign In
            </button>
          </Link>
          <Link href="/auth/signup">
            <button className="w-full cursor-pointer flex items-center gap-2 py-2 px-3 text-sm text-gray-700 font-medium rounded-lg ">
              <UserPlus /> Sign Up
            </button>
          </Link>
        </>
      );
    }

    return (
      <>
        <Link href="/profile">
          <button className="w-full cursor-pointer flex items-center gap-2 py-2 px-3 text-sm text-gray-700 font-medium rounded-lg hover:bg-gray-100">
            <UserPlus /> Account
          </button>
        </Link>
        <button
          className="w-full cursor-pointer flex items-center gap-2 py-2 px-3 text-sm text-red-900 font-medium rounded-lg "
          onClick={handleLogout}
        >
          <LogOut /> Log Out
        </button>
      </>
    );
  };

  return (
    <>
      <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${scrolled ? "bg-white shadow-md" : "bg-transparent"}`}>
        <div className="px-4 py-3 flex items-center justify-between max-w-7xl mx-auto">
          {/* Logo */}
          <Link href="/" className="flex items-center hover:scale-105 transition-transform duration-300">
            <Image src="/gadup2.png" alt="Logo" width={45} height={45} className="object-contain" />
            <h1 className="text-[#00817c] ml-1 font-serif text-xl font-bold">GadUp</h1>
          </Link>

          {/* Desktop Menu */}
          <ul className="hidden md:flex flex-1 justify-center gap-8 font-medium text-blue-500 font-serif">
            {categories.map((cat) => (
              <li key={cat.name} className="hover:text-blue-700 border-b-2 border-transparent hover:border-blue-700 transition-all duration-200">
                <Link href={cat.link}>{cat.name}</Link>
              </li>
            ))}
          </ul>

          {/* Right section */}
          <div className="flex items-center gap-4 relative">
            {/* Cart */}
            <div className="relative cursor-pointer" onClick={() => setCartOpen(true)}>
              <ShoppingCart className="w-6 h-6 text-gray-700 hover:text-red-600 transition-colors duration-200" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-teal-700 text-white font-bold w-5 h-5 rounded-full flex items-center justify-center text-xs">
                  {cartCount}
                </span>
              )}
            </div>
            <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />

            {/* User menu */}
            <div className="relative">
              <div
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="w-8 h-8 rounded-full bg-[#008080] text-white flex items-center justify-center font-semibold cursor-pointer"
              >
                {user?.name.charAt(0).toUpperCase() || <User className="w-5 h-5" />}
              </div>
              {userMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-40 bg-white shadow-lg rounded-lg flex flex-col py-1 z-50">
                  {renderUserMenu()}
                </div>
              )}
            </div>

            {/* Mobile menu toggle */}
            <button onClick={() => setMenuOpen(!menuOpen)} className="text-gray-700 hover:text-blue-600 focus:outline-none md:hidden">
              {menuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <>
            <div className="fixed inset-0 bg-black/30 z-40" onClick={() => setMenuOpen(false)}></div>
            <div className="fixed top-16 left-0 w-full bg-white shadow-lg rounded-b-xl flex flex-col items-center py-6 gap-4 md:hidden z-50 transition-transform duration-300">
              {categories.map((cat) => (
                <Link key={cat.name} href={cat.link} className="w-full text-center py-2 text-gray-700 font-medium hover:text-blue-600 hover:bg-gray-100 rounded-md" onClick={() => setMenuOpen(false)}>
                  {cat.name}
                </Link>
              ))}
              <div className="w-full h-[1px] bg-gray-300"></div>
              {renderUserMenu()}
            </div>
          </>
        )}
      </nav>
    </>
  );
}
