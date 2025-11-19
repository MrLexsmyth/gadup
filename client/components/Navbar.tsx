"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "../context/CartContext";
import { motion, AnimatePresence } from "framer-motion";
import CartDrawer from "./CartDrawer";
import { ShoppingCart, User, Menu, X, LogIn, UserPlus, LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import API from "../lib/api";

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

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Logout
const handleLogout = async () => {
  try {
    await API.post("/auth/logout"); 
    clearCart();
    setUser(null);
    router.push("/");
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error("Logout failed:", err.message);
    } else {
      console.error("Logout failed:", err);
    }
  }
};


  // Render user menu
  const renderUserMenu = () => {
    if (!user) {
      return (
        <>
          <Link href="/auth/login">
            <button className="w-full cursor-pointer flex items-center gap-2 py-2 px-3 text-sm text-gray-700 font-medium rounded-lg hover:bg-gray-100">
              <LogIn className="w-5 h-5" /> Sign In
            </button>
          </Link>
            <div className="w-full h-[1px] bg-gray-300"></div>
          <Link href="/auth/signup">
            <button className="w-full cursor-pointer flex items-center gap-2 py-2 px-3 text-sm text-gray-700 font-medium rounded-lg">
              <UserPlus  className="w-5 h-5"/> Sign Up
            </button>
          </Link>
        </>
      );
    }

    return (
      <>
        <Link href="/profile">
          <button className="w-full cursor-pointer flex items-center gap-2 py-2 px-3 text-sm text-gray-700 font-medium rounded-lg hover:bg-gray-100">
            <UserPlus className="w-5 h-5 "/> Account
          </button>
        </Link>
          <div className="w-full h-[1px] bg-gray-300"></div>
        <button
          className="w-full cursor-pointer flex items-center gap-2 py-2 px-3 text-sm text-red-900 font-medium rounded-lg"
          onClick={handleLogout}
        >
          <LogOut className="w-5 h-5 "/> Log Out
        </button>
      </>
    );
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
          scrolled ? "bg-white shadow-md" : "bg-transparent"
        }`}
      >
        <div className="px-4 py-3 flex items-center justify-between max-w-7xl mx-auto">
          {/* Logo */}
          <Link href="/" className="flex items-center hover:scale-105 transition-transform duration-300">
            <Image src="/gadup2.png" alt="Logo" width={45} height={45} className="object-contain" loading="eager" />
            <h1 className="text-[#00817c] ml-1 font-serif text-xl font-bold">GadUp</h1>
          </Link>

          {/* Desktop Menu */}
          <ul className="hidden md:flex flex-1 justify-center gap-8 font-medium text-[#008080] font-serif">
            {categories.map((cat) => (
              <li
                key={cat.name}
                className="hover:text-[#008080] border-b-2 border-transparent hover:border-green-700 transition-all duration-200"
              >
                <Link href={cat.link}>{cat.name}</Link>
              </li>
            ))}
          </ul>

          {/* Right section */}
          <div className="flex items-center gap-2 relative">
            {/* Cart */}
            <div className="relative cursor-pointer" onClick={() => setCartOpen(true)}>
              <ShoppingCart className="w-6 h-6 text-gray-700 hover:text-[#008080] transition-colors duration-200" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-teal-700 text-white font-bold w-4 h-4 rounded-full flex items-center justify-center text-xs">
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
                {user?.name.charAt(0).toUpperCase() || <User className="w-6 h-6" />}
              </div>
              {userMenuOpen && (
               <div className="  fixed top-14 right-0 w-40 bg-white shadow-lg rounded-lg flex flex-col py-1 z-50">
  {renderUserMenu()}
</div>

              )}
            </div>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-[#008080] hover:text-[#008080] focus:outline-none md:hidden"
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
<>
  {/* Overlay */}
  <AnimatePresence>
    {menuOpen && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.4 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        className="fixed inset-0 bg-black z-40"
        onClick={() => setMenuOpen(false)}
      />
    )}
  </AnimatePresence>

  {/* Slide Menu */}
  <AnimatePresence>
    
    {menuOpen && (
      <motion.div
        initial={{ x: "-100%" }}
        animate={{ x: 0 }}
        exit={{ x: "-100%" }}
        transition={{
          type: "spring",
          stiffness: 80,
          damping: 15,
          duration: 0.3,
        }}
        className="fixed top-0 left-0 h-screen w-[85%] max-w-[350px] bg-white shadow-lg 
        z-50 flex flex-col items-start py-6 gap-4 md:hidden"
      >
        {categories.map((cat, i) => (
          <motion.div
            key={cat.name}
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.1 * i }}
            className="w-full"
          >
            <Link
              href={cat.link}
              className="w-full text-start cursor-pointer px-8 text-[#008080] font-medium"
              onClick={() => setMenuOpen(false)}
            >
              {cat.name}
            </Link>
          </motion.div>
          
        ))}
          
       
        
      </motion.div>
    )}
  </AnimatePresence>
</>
        )}
      </nav>
    </>
  );
}
