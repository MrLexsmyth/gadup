"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Playfair_Display, Inter } from "next/font/google";



const slides = [
  { text: "SPECIAL COLLECTION 2025", sub: "Experence music like never before with our nice selection of premium headphones. Crafted with precision and designed. ", image: "/hero3.jpg", textPosition: "left" }, 
  { text: "Highlight Show",sub: "Experience the future of innovation with our cutting-edge designs.", image: "/hero2.jpg", textPosition: "left" },
  { text: "Elegant tone Premiem", sub:"High-fidelity sound — no Bluetooth, no compromise.", image: "/hero1.jpg", textPosition: "right" },
  { text: "Last Slide", sub:"Old-school connection. New-age sound.", image: "/hero4.jpg", textPosition: "right" },
];

const playfair = Playfair_Display({ subsets: ["latin"], weight: ["700"] });
const inter = Inter({ subsets: ["latin"], weight: ["400"] });


export default function Slide() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, 6000); 
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full h-[450px] relative overflow-hidden">
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
            className="object-cover"
          />

          <div
            className={`absolute top-1/2 transform -translate-y-1/2 p-6 max-w-lg text-white ${
              slides[index].textPosition === "left" ? "left-30 text-left" : "right-30 text-right"
            }  rounded-md`}
          >
             <h2
          className={`${playfair.className} text-3xl md:text-5xl font-bold leading-tight mb-3`}
        >
          {slides[index].text}
        </h2>
        <p className={`${inter.className} text-base md:text-lg text-gray-200`}>
          {slides[index].sub}
        </p>
         <Link
            href="/products/category"
            className={`${playfair.className} inline-block bg-blue-600 mt-4 hover:bg-blue-700 text-white font-semibold py-2 px-3 rounded shadow-lg transition-all duration-300`}>
                     To Shop
         </Link>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
