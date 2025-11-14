"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Playfair_Display } from "next/font/google";

const slides = [
  { 
    text: "SPECIAL COLLECTION 2025", 
    sub: "Experience music like never before with our nice selection of premium headphones. Crafted with precision and designed.", 
    image: "/hero3.jpg", 
    textPosition: "left",
    color: "#008080"            
  }, 
  { 
    text: "Highlight Show", 
    sub: "Experience the future of innovation with our cutting-edge designs.", 
    image: "/hero2.jpg", 
    textPosition: "left",
    color: "#ffcc00"           
  },
  { 
    text: "Elegant tone Premium", 
    sub:"High-fidelity sound — no Bluetooth, no compromise.", 
    image: "/hero1.jpg", 
    textPosition: "right",
    color: "#008080" 
  },
  { 
    text: "Evergreen Sounds", 
    sub:"Old-school connection. New-age sound.", 
    image: "/hero4.jpg", 
    textPosition: "right",
    color: "#ff4d4d"
  },
];

const playfair = Playfair_Display({ subsets: ["latin"], weight: ["700"] });

export default function Slide() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const currentColor = slides[index].color || "#ffffff"; // fallback color

  return (
    <div 
      className="w-full h-[450px] md:h-[450px] relative overflow-hidden"
      style={{ fontFamily: "Playfair Display, serif" }}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ duration: 0.5 }}
          className="absolute w-full h-full"
        >
          <Image
            src={slides[index].image}
            alt={slides[index].text}
            fill
            loading="eager"
            className="object-cover"
          />

          <div
            className={`absolute top-1/2 transform -translate-y-1/2 p-4 sm:p-6 max-w-lg 
              ${slides[index].textPosition === "left" ? 
                "left-4 sm:left-6 md:left-30 text-left" : 
                "right-4 sm:right-6 md:right-30 text-right"
              }`}
          >
            <h2 
              className={`${playfair.className} text-2xl sm:text-3xl md:text-5xl font-bold leading-tight mb-2 sm:mb-3`}
              style={{ color: currentColor }}
            >
              {slides[index].text}
            </h2>

            <p 
              className={`${playfair.className} text-sm sm:text-base md:text-lg`}
              style={{ color: currentColor }}
            >
              {slides[index].sub}
            </p>

            <Link
              href="/products/category"
              className={`${playfair.className} inline-block mt-3 sm:mt-4 font-semibold py-2 px-3 rounded shadow-lg transition-all duration-300`}
              style={{
                backgroundColor: currentColor,
                color: "#ffffff",
                border: `2px solid ${currentColor}`,
              }}
            >
              To Shop
            </Link>
          </div>

        </motion.div>
      </AnimatePresence>
    </div>
  );
}
