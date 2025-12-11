"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import API from "../../../../lib/api"; 

interface Product {
  _id: string;
  name: string;
  price: number;
  discountPrice?: number;
  discountPercentage?: number;
  stock: number;
  category: string;
  images?: { url: string }[]; // ✅ updated for multiple images
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await API.get<Product[]>("/products");
        setProducts(data);
      } catch (err) {
        console.error("Failed to fetch products:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      await API.delete(`/products/${id}`);
      setProducts((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      console.error("Failed to delete product:", err);
      alert("Failed to delete product. Check console for details.");
    }
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
              {/* ✅ MULTIPLE IMAGES DISPLAY */}
              <div className="flex gap-2 overflow-x-auto">
                {product.images && product.images.length > 0 ? (
                  product.images.map((img, index) => (
                    <Image
                      key={index}
                      src={img.url}
                      alt={`${product.name} image ${index + 1}`}
                      width={200}
                      height={150}
                      className="h-28 w-40 object-cover rounded"
                    />
                  ))
                ) : (
                  <Image
                    src="/placeholder.jpg"
                    alt="placeholder"
                    width={200}
                    height={150}
                    className="h-28 w-40 object-cover rounded"
                  />
                )}
              </div>

              <h3 className="font-semibold mt-3">{product.name}</h3>

              {product.discountPrice && product.discountPrice > 0 ? (
                <p className="text-red-600 font-bold">
                  ₦{product.discountPrice.toLocaleString()}{" "}
                  <span className="line-through text-gray-500 ml-2">
                    ₦{product.price.toLocaleString()}
                  </span>{" "}
                  <span className="text-green-600 ml-1">
                    ({ (product.discountPercentage ?? 0)}% off)
                  </span>
                </p>
              ) : (
                <p className="text-gray-600 font-bold">
                  ₦{product.price.toLocaleString()}
                </p>
              )}

              <p className="text-sm text-gray-500">
                {product.category.charAt(0).toUpperCase() +
                  product.category.slice(1)}
              </p>

              {/* 🟩 STOCK */}
              <p className="text-sm font-medium mt-1">
                Stock:{" "}
                {product.stock === 0 ? (
                  <span className="text-red-600 font-bold">Out of Stock</span>
                ) : (
                  <span className="text-green-700">{product.stock}</span>
                )}
              </p>

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
