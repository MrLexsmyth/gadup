"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import Image from "next/image";
import { useAuth } from "../../../../context/AuthContext";
import { useCart } from "../../../../context/CartContext";
import { Playfair_Display } from "next/font/google";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});


interface Product {
  _id: string;
  name: string;
  image: { url: string };
  price: number;
  category: string;
  description: string;
}

export default function ProductPage() {
  const { id } = useParams(); // product ID from URL
  const router = useRouter();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    setAuthLoading(false);
  }, [user]);

  // Fetch product by ID
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await axios.get<Product>(  
          `${process.env.NEXT_PUBLIC_API_URL}/products/${id}`
        );
        setProduct(data);
      } catch (err) {
        console.error("Failed to fetch product:", err);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (authLoading) return;

    if (!user) {
      router.push(`/auth/login?redirect=/product/${id}`);
      return;
    }

    if (product) addToCart({ ...product, quantity: 1 });
  };

  if (loading) return <p className="p-6 text-center">Loading product...</p>;
  if (!product) return <p className="p-6 text-center">Product not found.</p>;

  return (
   <div className={playfair.className + " max-w-6xl mx-auto p-6 flex flex-col md:flex-row gap-6"}>
      {/* Product Image */}
      <div className="relative w-full md:w-1/2 h-80 md:h-[500px] bg-gray-100 rounded-lg overflow-hidden">
        <Image
          src={product.image?.url || "/placeholder.png"}
          alt={product.name}
          fill
          className="object-cover"
        />
      </div>

      {/* Product Details */}
      <div className="flex-1 flex flex-col">
        <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
        <p className="text-gray-500 mb-4 capitalize">{product.category}</p>
        <p className="text-red-600 font-bold text-2xl mb-4">
          ₦{product.price.toLocaleString()}
        </p>
       <div
  className="text-gray-700 mb-6"
  dangerouslySetInnerHTML={{ __html: product.description }}
></div>


        {/* Add to Cart */}
        <button
          onClick={handleAddToCart}
          disabled={authLoading}
          className="w-full cursor-pointer md:w-auto bg-[#00817c] text-white py-3 px-6 rounded hover:bg-[#006c65] transition mb-4"
        >
          Add to Cart
        </button>

        {/* Optional: Back to products */}
        <button
          onClick={() => router.back()}
          className="w-full md:w-auto text-[#00817c] py-2 px-4 rounded border border-[#00817c] hover:bg-[#00817c]/10 transition"
        >
          Back to Products
        </button>
      </div>
    </div>
  );
}
