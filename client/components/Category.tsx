"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, Variants } from "framer-motion";

interface Category {
  name: string;
  image?: string;
}

const categories: Category[] = [
  { name: "Fashion", image: "/categories/accessories.png" },
  { name: "Electronics", image: "/categories/phones.png" },
  { name: "Phones", image: "/categories/phones.png" },
  { name: "Toys", image: "/categories/toys.png" },
  { name: "Laptops", image: "/categories/laptops.jpg" },
  { name: "Gaming Accessories", image: "/categories/gaming.png" },
  { name: "General Accessories", image: "/categories/accessories.png" },
];

// Container animation with staggered children
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

// Individual category card animation
const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { type: "spring", stiffness: 120, damping: 20 } 
  },
  hover: { 
    scale: 1.05, 
    boxShadow: "0px 10px 20px rgba(0,0,0,0.15)",
    backgroundColor: "#f87171", // Tailwind bg-red-400 hex
    transition: { type: "spring", stiffness: 300 } 
  },
};

export default function CategoryBrowser() {
  return (
    <div className="px-16 py-8">
      <div className="w-full h-[1px] bg-gray-400 my-4"></div>
      {/* <h3
       className="text-xl font-boldtext-start mt-12"
        style={{ fontFamily: "Playfair Display, serif" }}>Categories</h3> */}

      <h2
        className="text-2xl font-bold mb-8 text-start mt-6"
        style={{ fontFamily: "Playfair Display, serif" }}
      >
        Browse by Category
      </h2>

      <motion.div
        className="flex gap-4 scrollbar-hide mb-8 flex-wrap md:flex-nowrap grid-cols-1 sm:grid-cols-2 justify-center items-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {categories.map((cat) => (
          <motion.div
            key={cat.name}
            variants={itemVariants}
            whileHover="hover"
            className="flex-shrink-0 w-44 h-40 rounded-lg overflow-hidden"
          >
            <Link
              href={`/products/category/${cat.name
                .toLowerCase()
                .replace(/\s+/g, "-")}`}
              className="w-full h-full flex flex-col items-center justify-center border border-gray-200 bg-white"
            >
              {cat.image && (
                <div className="w-16 h-16 mb-2 relative">
                  <Image
                    src={cat.image}
                    alt={cat.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover"
                    loading="eager"
                  />
                </div>
              )}
              <span className="text-sm font-medium text-gray-700">
                {cat.name}
              </span>
            </Link>
          </motion.div>
        ))}
      </motion.div>

      <div className="w-full h-[1px] bg-gray-400 my-4 mt-16"></div>
    </div>
  );
}
