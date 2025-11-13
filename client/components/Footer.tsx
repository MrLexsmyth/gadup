"use client";
import React from "react";
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from "lucide-react";
import Link from "next/link";
import ScrollToTopButton from "./ScrollToTopButton";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-10 px-6 md:px-16"
    style={{ fontFamily: "Playfair Display, serif" }}>
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Brand */}
        <div>
          <h2 className="text-2xl font-bold text-[#008080] mb-4">GadUp</h2>
          <p className="text-sm leading-relaxed">
            Your one-stop shop for the latest gadgets, accessories, and more. Quality products at unbeatable prices.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li><Link href="/" className="hover:text-blue-400 transition">Home</Link></li>
            <li><Link href="/products/category" className="hover:text-blue-400 transition">Shop</Link></li>
            <li><Link href="/about" className="hover:text-blue-400 transition">About Us</Link></li>
            <li><Link href="/contact" className="hover:text-blue-400 transition">Contact</Link></li>
          </ul>
        </div>

        {/* Customer Service */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Customer Service</h3>
          <ul className="space-y-2 text-sm">
            <li><Link href="/faq" className="hover:text-blue-400 transition">FAQs</Link></li>
            <li><Link href="/shipping" className="hover:text-blue-400 transition">Shipping & Returns</Link></li>
            <li><Link href="/privacy" className="hover:text-blue-400 transition">Privacy Policy</Link></li>
            <li><Link href="/terms" className="hover:text-blue-400 transition">Terms & Conditions</Link></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Contact Us</h3>
          <ul className="space-y-3 text-sm">
            <li className="flex items-center gap-2">
              <Phone size={16} /> +234 816 927 3808
            </li>
            <li className="flex items-center gap-2">
              <Mail size={16} /> support@gadup.com
            </li>
            <li className="flex items-center gap-2">
              <MapPin size={16} /> Lagos, Nigeria
            </li>
          </ul>

          {/* Social Icons */}
          <div className="flex items-center gap-4 mt-4">
            <Link href="#" className="hover:text-blue-400 transition"><Facebook /></Link>
            <Link href="#" className="hover:text-pink-500 transition"><Instagram /></Link>
            <Link href="#" className="hover:text-sky-400 transition"><Twitter /></Link>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="border-t border-gray-700 mt-10 pt-4 text-center text-sm text-gray-400">
        © {new Date().getFullYear()} <span className="text-[#008080] font-semibold">GadUp</span>. All rights reserved.
      </div>
      <ScrollToTopButton />
    </footer>
  );
};

export default Footer;
