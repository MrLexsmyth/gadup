"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import API from "../../../../lib/api";
import { useCart } from "../../../../context/CartContext"; // ✅ Make sure this import path matches your setup

interface Product {
  _id: string;
  name: string;
  price: number;
  category: string;
  image?: { url: string };
}

export default function CategoryPage() {
  const params = useParams();
  const categoryName = params.category as string;

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(false);
  const { addToCart } = useCart(); // ✅ from your CartContext

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await API.get<Product[]>(
          `/products?category=${encodeURIComponent(categoryName)}`
        );
        setProducts(data);
      } catch (err) {
        console.error("Failed to fetch products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [categoryName]);
const handleAddToCart = async (product: Product) => {
  try {
    setAuthLoading(true);
    await addToCart({ ...product, quantity: 1 }); // ✅ add quantity here
  } catch (error) {
    console.error("Error adding to cart:", error);
  } finally {
    setAuthLoading(false);
  }
};


  if (loading) return <p className="text-center mt-6">Loading products...</p>;

  return (
    <div className="px-6 py-8" style={{ fontFamily: "Playfair Display, serif" }}>
      <h1 className="text-2xl font-bold mb-6 capitalize">
        {categoryName.replace("-", " ")}
      </h1>

      {products.length === 0 ? (
        <p className="text-center text-gray-500">No products found.</p>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          {products.map((product) => (
            <div
              key={product._id}
              className="group border rounded-lg p-4 shadow-sm hover:shadow-md transition relative overflow-hidden"
            >
              {/* Product image */}
              <div className="relative w-full h-[220px] bg-[#f5f5f5] rounded overflow-hidden">
                <Image
                  src={product.image?.url || "/placeholder.jpg"}
                  alt={product.name}
                  fill
                  className="object-cover rounded transition-transform duration-300 group-hover:scale-105"
                />

                {/* Add to Cart overlay button */}
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
                    className="font-medium text-sm cursor-pointer "
                    onClick={() => handleAddToCart(product)}
                    disabled={authLoading}
                  >
                    {authLoading ? "Adding..." : "Add to Cart"}
                  </button>
                </div>
              </div>

              <h3 className="font-semibold mt-3">{product.name}</h3>
              <p className="text-gray-600">
                ₦{Number(product.price).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
