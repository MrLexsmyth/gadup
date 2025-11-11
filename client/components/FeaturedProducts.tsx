"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

interface Product {
  _id: string;
  name: string;
  price: number;
  category: string;
  image?: { url: string };
}

export default function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  const { user, loading: authLoading } = useAuth(); // use AuthContext loading
  const { addToCart } = useCart();

  useEffect(() => {
  fetch(`${process.env.NEXT_PUBLIC_API_URL}/test`)
    .then((res) => res.json())
    .then((data) => console.log(data))
    .catch((err) => console.error("Connection failed ❌", err));
}, []);


  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch( `${process.env.NEXT_PUBLIC_API_URL}/api/products`, {
          credentials: "include",
        });
        if (!res.ok) throw new Error("Failed to fetch products");
        const data: Product[] = await res.json();

        const shuffled = data.sort(() => 0.5 - Math.random());
        const selected = shuffled.slice(0, 6);
        setProducts(selected);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) return <p className="p-6 text-center">Loading...</p>;
  if (!products.length) return <p className="p-6 text-center">No products available.</p>;

  const handleAddToCart = (product: Product) => {
    if (authLoading) return; // wait until auth state is loaded

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
            <div className="relative w-full h-[220px] bg-[#f5f5f5] rounded overflow-hidden group">
              <Image
                src={product.image?.url || "/placeholder.jpg"}
                alt={product.name}
                fill
                className="object-cover rounded"
              />

              {/* Add to Cart Overlay */}
              <div
                className="absolute bottom-0 left-0 w-full bg-[#00817c]/90 text-white text-center py-3
                           opacity-0 translate-y-6 group-hover:opacity-100 group-hover:translate-y-0
                           transition-all duration-500 ease-out cursor-pointer"
              >
               <button
  className="font-medium text-sm cursor-pointer"
  onClick={() => handleAddToCart(product)}
  disabled={authLoading} 
  style={{ opacity: authLoading ? 0.5 : 1, cursor: authLoading ? "not-allowed" : "pointer" }}
>
  {authLoading ? "Checking..." : "Add to Cart"}
</button>

              </div>
            </div>

            <h3 className="font-semibold mt-3">{product.name}</h3>

            <p className="text-red-600 font-semibold mt-1">
              ₦{Number(product.price).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
