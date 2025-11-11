"use client";

import { useEffect, useState } from "react";
import ProductSlider from "../components/Slider"; // adjust path

interface Product {
  _id: string;
  name: string;
  price: number;
  category: string;
  image: { url: string };
  description: string;
}

export default function SetAll() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch( `${process.env.NEXT_PUBLIC_API_URL}/api/products`);
        const data = await res.json();
        setProducts(data);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  if (loading) return <p className="p-6 text-center">Loading products...</p>;

  return (
    <main className="px-6 py-8">
      
      {products.length > 0 ? (
        <ProductSlider
          products={products.map((p) => ({
            _id: p._id,
            name: p.name,
            price: p.price,
            image: p.image.url,
            description: p.description,
          }))}
        />
      ) : (
        <p className="text-center">No products available right now.</p>
      )}
    </main>
  );
}
