"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "../../../context/AuthContext";
import { useCart } from "../../../context/CartContext";
import API from "../../../lib/api"; 
import { Playfair_Display } from "next/font/google"; 

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});



interface Product {
  _id: string;
  name: string;
  image?: { url: string };
  price: number;
  category: string;
}

export default function CategoryPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [categories, setCategories] = useState<string[]>([]);

  const { user } = useAuth();
  const { addToCart } = useCart();
  const router = useRouter();
  const pathname = usePathname();
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    setAuthLoading(false);
  }, [user]);

  // Fetch all products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await API.get<Product[]>("/products");

        setProducts(data);

        const uniqueCategories: string[] = [
          "all",
          ...Array.from(
            new Set(
              data.map(
                (p) =>
                  typeof p.category === "string" && p.category.trim()
                    ? p.category.trim()
                    : "Uncategorized"
              )
            )
          ),
        ];

        setCategories(uniqueCategories);
      } catch (err) {
        console.error("Failed to fetch products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts =
    selectedCategory === "all"
      ? products
      : products.filter((p) => p.category === selectedCategory);

  const handleAddToCart = (product: Product) => {
    if (authLoading) return;

    if (!user) {
      router.push(`/auth/login?redirect=${pathname}`);
      return;
    }

    addToCart({ ...product, quantity: 1 });
  };

  if (loading) return 
                        <div className="flex flex-col items-center justify-center py-16">
                            <Image src="/gadup2.png" alt="Loading" width={300} height={300} className="animate-pulse" />
                            <p className="mt-3 text-gray-600 font-medium">Loading GadUp collections...</p>
                        </div>
;

  return (
    <div className={playfair.className}>
      <div className="max-w-7xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">All Products</h1>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-6">
          {categories.map((cat) => (
           <button
  key={cat}
  onClick={() => setSelectedCategory(cat)}
  className={`px-5 py-2.5 cursor-pointer rounded-full text-sm font-medium capitalize transition-all duration-300 ease-in-out 
    border ${
      selectedCategory === cat
        ? "bg-[#008080] text-white shadow-md scale-105 border-transparent"
        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-[#008080]/50 hover:text-[#008080]"
    }`}
>
  {cat}
</button>

          ))}
        </div>

        {filteredProducts.length === 0 ? (
          <p>No products found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <div
                key={product._id}
                className="  overflow-hidden shadow-sm hover:shadow-md transition"
              >
                <div className="relative w-full h-56 bg-gray-100 group">
                  <Image
                    src={product.image?.url || "/placeholder.png"}
                    alt={product.name}
                    fill
                    className="object-cover rounded"
                  />

                  <div
                     className={`
    absolute bottom-0 left-0 w-full bg-[#00817c]/90 text-white text-center py-3
    opacity-100 translate-y-0
     transition-all duration-500 ease-out cursor-pointer
    group-hover:opacity-100 group-hover:translate-y-0
    sm:opacity-0 sm:translate-y-6  
  `}
                  >
                    <button
                      onClick={() => handleAddToCart(product)}
                      disabled={authLoading}
                      className="font-medium text-sm cursor-pointer"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>

                <div className="p-4">
                  <h2 className="font-semibold text-base">{product.name}</h2>
                  <p className="text-gray-500 text-sm capitalize">
                    {product.category}
                  </p>
                  <p className="font-bold mt-1 text-red-600">
                    ₦{product.price.toLocaleString()}
                  </p>

                  <Link
                    href={`/products/details/${product._id}`}
                    className="text-sm text-[#00817c] font-medium hover:underline block mt-2"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
