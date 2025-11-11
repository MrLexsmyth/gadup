"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import API from "../../../../lib/api"; // import shared Axios instance

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

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Use API.get to automatically handle baseURL and credentials
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

  if (loading) return <p className="text-center mt-6">Loading products...</p>;

  return (
    <div className="px-6 py-8">
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
              className="border rounded-lg p-4 shadow-sm hover:shadow-md transition"
            >
              <div className="relative w-full h-[220px] bg-[#f5f5f5] rounded overflow-hidden">
                <Image
                  src={product.image?.url || "/placeholder.jpg"}
                  alt={product.name}
                  fill
                  className="object-cover rounded"
                />
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
