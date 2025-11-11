"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

interface Product {
  _id: string;
  name: string;
  price: number;
  category: string;
  image: { url: string };
}


  
      
   

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    
    const fetchProducts = async () => {
      const res = await fetch(`${apiUrl}/products`, {
        credentials: "include",
      });
      const data = await res.json();
      setProducts(data);
      setLoading(false);
    };
    fetchProducts();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    await fetch(`http://localhost:5000/api/products/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    setProducts((prev) => prev.filter((p) => p._id !== id));
  };

  if (loading) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Products</h1>
        <Link
          href="/admin/dashboard/products/add"
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          + Add Product
        </Link>
      </div>

      {products.length === 0 ? (
        <p>No products found.</p>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          {products.map((product) => (
            <div
              key={product._id}
              className="border rounded-lg p-4 shadow-sm hover:shadow-md transition"
            >
              <Image
  src={product.image?.url || "/placeholder.jpg"} 
  alt={product.name}
  width={400}
  height={300}
  className="h-40 w-full object-cover rounded"
/>
              <h3 className="font-semibold mt-3">{product.name}</h3>
              <p className="text-gray-600">₦{product.price.toLocaleString()}</p>
              <p className="text-sm text-gray-500">{product.category.charAt(0).toUpperCase() + product.category.slice(1)}</p>
              <div className="flex justify-between mt-3">
                <Link
                  href={`/admin/dashboard/products/edit/${product._id}`}
                  className="text-blue-600"
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(product._id)}
                  className="text-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
