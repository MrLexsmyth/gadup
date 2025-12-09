"use client";

import { useEffect, useState, FormEvent } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import API from "../../../../../../lib/api"; // centralized axios instance

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  discountPrice?: number;
  discountPercentage?: number;
  stock: number;   
  image?: {
    url: string;
    public_id: string;
  };
}


export default function EditProductPage() {
  const { id } = useParams();
  const router = useRouter();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState<number>(0);
  const [discountPrice, setDiscountPrice] = useState<number>(0);
  const [stock, setStock] = useState<number>(0);

  const [discountPercentage, setDiscountPercentage] = useState<number>(0);
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Fetch product on mount
  useEffect(() => {
    if (!id) return;

    const fetchProduct = async () => {
      try {
        const { data } = await API.get<Product>(`/products/${id}`);
        setName(data.name);
        setDescription(data.description);
        setPrice(data.price);
        setStock(data.stock ?? 0);
        setDiscountPrice(data.discountPrice || 0);
        setDiscountPercentage(data.discountPercentage || 0);
        setPreview(data.image?.url || null);
      } catch (error) {
        console.error("Failed to fetch product", error);
      }
    };

    fetchProduct();
  }, [id]);

  // Calculate discount percentage whenever price or discountPrice changes
  useEffect(() => {
    if (price && discountPrice && discountPrice > 0 && discountPrice < price) {
      const percentage = ((price - discountPrice) / price) * 100;
      setDiscountPercentage(Math.round(percentage));
    } else {
      setDiscountPercentage(0);
    }
  }, [price, discountPrice]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price.toString());
      formData.append("discountPrice", discountPrice.toString());
      formData.append("discountPercentage", discountPercentage.toString());
      formData.append("stock", stock.toString());

      if (image) formData.append("image", image);

      await API.put(`/products/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("✅ Product updated successfully!");
      router.push("/admin/dashboard/products");
    } catch (error) {
      console.error("Error updating product:", error);
      alert("❌ Failed to update product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Edit Product</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Product Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border p-2 rounded"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border p-2 rounded"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Price</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(parseFloat(e.target.value))}
            className="w-full border p-2 rounded"
            required
          />
        </div>
        <div>
  <label className="block text-sm font-medium">Stock Quantity</label>
 <input
  type="number"
  value={stock ?? 0}   // 🚀 prevents NaN
  onChange={(e) => setStock(Number(e.target.value))}
  className="w-full border p-2 rounded"
  min={0}
  required
/>

</div>


        <div>
          <label className="block text-sm font-medium">Discount Price</label>
          <input
            type="number"
            value={discountPrice ?? ""}
            onChange={(e) => setDiscountPrice(parseFloat(e.target.value))}
            className="w-full border p-2 rounded"
            min={0}
            max={price}
          />
          {discountPercentage > 0 && (
            <p className="text-sm text-green-600 mt-1">
              Discount: {discountPercentage}%
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium">Product Image</label>
          <input type="file" onChange={handleImageChange} accept="image/*" />
        </div>

        {preview && (
          <div className="mt-4">
            <Image
              src={preview}
              alt="Product preview"
              width={100}
              height={50}
              className="rounded shadow-md object-cover"
            />
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {loading ? "Updating..." : "Update Product"}
        </button>
      </form>
    </div>
  );
}
