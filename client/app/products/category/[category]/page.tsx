"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useParams, useRouter, usePathname } from "next/navigation";
import API from "../../../../lib/api";
import { useCart } from "../../../../context/CartContext";
import { useAuth } from "../../../../context/AuthContext";

interface Product {
  _id: string;
  name: string;
  price: number;
   discountPrice?: number;
  discountPercentage?: number;
  category: string;
images: { url: string; public_id: string }[]; 
}

export default function CategoryPage() {
  const params = useParams();
  const categoryName = params.category as string;

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState(false); // renamed for clarity

  const router = useRouter();
  const pathname = usePathname();

  const { user, loading: authLoading } = useAuth(); // from AuthContext
  const { addToCart } = useCart();

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
    if (authLoading || addingToCart) return;

    if (!user) {
      router.push(`/auth/login?redirect=${pathname}`);
      return;
    }

    try {
      setAddingToCart(true);
      addToCart({ ...product, quantity: 1 }); //  added quantity
    } finally {
      setAddingToCart(false);
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
                  src={product.images && product.images.length > 0 ? product.images[1].url : "/placeholder.png"}
                  alt={product.name}
                  fill
                  className="object-cover rounded"
                />

                {/* Add to Cart overlay button */}
                <div
                  className={`
                    absolute bottom-0 left-0 w-full bg-[#00817c]/90 text-white text-center py-3
                    opacity-100 translate-y-0 transition-all duration-500 ease-out cursor-pointer
                    group-hover:opacity-100 group-hover:translate-y-0 sm:opacity-0 sm:translate-y-6
                  `}
                >
                  <button
                    className="font-medium text-sm"
                    onClick={() => handleAddToCart(product)}
                    disabled={addingToCart || authLoading}
                    style={{
                      opacity: addingToCart || authLoading ? 0.5 : 1,
                      cursor:
                        addingToCart || authLoading
                          ? "not-allowed"
                          : "pointer",
                    }}
                  >
                    {addingToCart
                      ? "Adding..."
                      : authLoading
                      ? "Checking..."
                      : "Add to Cart"}
                  </button>
                </div>
              </div>

              <h3 className="font-semibold mt-3">{product.name}</h3>
             {product.discountPrice && product.discountPrice > 0 ? (
  <p className="text-red-600 font-bold">
    ₦{product.discountPrice.toLocaleString()}{" "}
    <span className="line-through text-gray-500 ml-2">
      ₦{product.price.toLocaleString()}
    </span>{" "}
   <span className="text-green-600 ml-1">
  ({(product.discountPercentage ?? 0)}% )
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
      )}
    </div>
  );
}
