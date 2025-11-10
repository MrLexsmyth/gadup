"use client";
import { useState, useEffect } from "react";
import { Product } from "../types/product";
import { createProduct, updateProduct, uploadImage } from "../services/productService";

interface Props {
  product?: Product | null;
  onSuccess: () => void;
}

export default function ProductForm({ product, onSuccess }: Props) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [category, setCategory] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (product) {
      setName(product.name);
      setDescription(product.description);
      setPrice(product.price);
      setCategory(product.category);
    }
  }, [product]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imageUrl = product?.image || "";
      if (imageFile) {
        imageUrl = await uploadImage(imageFile);
      }

      const productData: Product = { name, description, price, category, image: imageUrl };

      if (product?._id) {
        await updateProduct(product._id, productData);
      } else {
        await createProduct(productData);
      }

      onSuccess();
      setName("");
      setDescription("");
      setPrice(0);
      setCategory("");
      setImageFile(null);
    } catch (err) {
      console.error(err);
      alert("Product save failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow space-y-2">
      <h2 className="text-lg font-bold">{product ? "Edit Product" : "Add Product"}</h2>

      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="border p-2 rounded w-full"
        required
      />

      <input
        type="text"
        placeholder="Category"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="border p-2 rounded w-full"
        required
      />

      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="border p-2 rounded w-full"
        required
      />

      <input
        type="number"
        placeholder="Price"
        value={price}
        onChange={(e) => setPrice(Number(e.target.value))}
        className="border p-2 rounded w-full"
        required
      />

      <input
        type="file"
        onChange={(e) => setImageFile(e.target.files?.[0] || null)}
        className="border p-2 rounded w-full"
      />

      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 text-white py-2 px-4 rounded"
      >
        {loading ? "Saving..." : product ? "Update Product" : "Add Product"}
      </button>
    </form>
  );
}
