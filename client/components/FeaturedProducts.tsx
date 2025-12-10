"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import API from "../lib/api"; // Axios instance

interface Product {
  _id: string;
  name: string;
  price: number;
  discountPrice?: number;
  discountPercentage?: number;
  category: string;
  image?: { url: string };
  stock: number;   
}


export default function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const router = useRouter();
  const pathname = usePathname();

  const { user, loading: authLoading } = useAuth();
  const { addToCart } = useCart();

  // Fetch products from backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await API.get<Product[]>("/products"); 
        // Shuffle and pick 6 random products
        const selected = data.sort(() => 0.5 - Math.random()).slice(0, 6);
        setProducts(selected);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading)
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="animate-pulse p-4 border rounded shadow">
            <div className="bg-gray-300 h-48 w-full mb-4 rounded"></div>
            <div className="h-4 bg-gray-300 rounded mb-2 w-3/4"></div>
            <div className="h-4 bg-gray-300 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );

  if (!products.length)
    return <p className="p-6 text-center">No products available.</p>;

const handleAddToCart = (product: Product) => {
  if (authLoading) return;

  if (product.stock <= 0) {
    alert("This product is out of stock.");
    return;
  }

  if (!user) {
    router.push(`/auth/login?redirect=${pathname}`);
    return;
  }

  addToCart({ ...product, quantity: 1 });
};


  return (
    <div>
      <div
        className="flex gap-4 overflow-x-auto p-6"
        style={{ fontFamily: "Playfair Display, serif" }}
      >
        {products.map((product) => (
          <div
            key={product._id}
            className="flex-shrink-0 w-[350px] h-[350px] rounded-lg p-4 shadow-sm hover:shadow-md transition"
          >
            <div className="relative w-full h-[240px] bg-[#f5f5f5] rounded overflow-hidden group">
              <Image
                src={product.image?.url || "/placeholder.jpg"}
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
  className="font-medium text-sm"
  onClick={() => handleAddToCart(product)}
  disabled={authLoading || product.stock <= 0}
  style={{
    opacity: product.stock <= 0 ? 0.6 : 1,
    cursor: product.stock <= 0 ? "not-allowed" : "pointer",
  }}
>
  {product.stock <= 0
    ? "Out of Stock"
    : authLoading
    ? "Checking..."
    : "Add to Cart"}
</button>

              </div>
            </div>

            <h3 className="font-semibold mt-3">{product.name}</h3>

            {/* Discount logic */}
                     {product.discountPrice && product.discountPrice > 0 ? (
  <p className="text-red-600 font-bold">
    ₦{product.discountPrice.toLocaleString()}{" "}
    <span className="line-through text-gray-500 ml-2">
      ₦{product.price.toLocaleString()}
    </span>{" "}
   <span className="text-green-600 ml-1">
  ({100 - (product.discountPercentage ?? 0)}% off)
</span>

  </p>
) : (
  <p className="text-gray-600 font-bold">
    ₦{product.price.toLocaleString()}
  </p>
)}
          </div>
        ))}
      </div>
    </div>
  );
}
