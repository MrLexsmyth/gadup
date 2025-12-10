"use client";

import { useEffect, useState, FormEvent } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import API from "../../../../../../lib/api";

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  discountPrice?: number;
  discountPercentage?: number;
  stock: number;
  images?: { url: string; public_id: string }[];
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

  const [existingImages, setExistingImages] = useState<{ url: string; public_id: string }[]>([]);
  const [newImages, setNewImages] = useState<File[]>([]);
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch product
  useEffect(() => {
    if (!id) return;

    const fetchProduct = async () => {
      try {
        const { data } = await API.get<Product>(`/products/${id}`);

        setName(data.name);
        setDescription(data.description);
        setPrice(data.price);
        setStock(data.stock);
        setDiscountPrice(data.discountPrice || 0);
        setDiscountPercentage(data.discountPercentage || 0);

        setExistingImages(data.images || []);
      } catch (error) {
        console.error("Failed to fetch product", error);
      }
    };

    fetchProduct();
  }, [id]);

  // Recalculate discount %
  useEffect(() => {
    if (discountPrice > 0 && discountPrice < price) {
      setDiscountPercentage(Math.round(((price - discountPrice) / price) * 100));
    } else {
      setDiscountPercentage(0);
    }
  }, [price, discountPrice]);

  // Handle new file selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const selectedFiles = Array.from(files);
    setNewImages(selectedFiles);

    const previews = selectedFiles.map((file) => URL.createObjectURL(file));
    setPreviewImages(previews);
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

      newImages.forEach((img) => formData.append("images", img));

      await API.put(`/products/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("✅ Product updated successfully!");
      router.push("/admin/dashboard/products");
    } catch (error) {
      console.error("Error updating product:", error);
      alert("Failed to update product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Edit Product</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* NAME */}
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

        {/* DESCRIPTION */}
        <div>
          <label className="block text-sm font-medium">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border p-2 rounded"
            required
          />
        </div>

        {/* PRICE */}
        <div>
          <label className="block text-sm font-medium">Price</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            className="w-full border p-2 rounded"
            required
          />
        </div>

        {/* STOCK */}
        <div>
          <label className="block text-sm font-medium">Stock Quantity</label>
          <input
            type="number"
            value={stock ?? 0}
            onChange={(e) => setStock(Number(e.target.value))}
            className="w-full border p-2 rounded"
            min={0}
            required
          />
        </div>

        {/* DISCOUNT */}
        <div>
          <label className="block text-sm font-medium">Discount Price</label>
          <input
            type="number"
            value={discountPrice}
            onChange={(e) => setDiscountPrice(Number(e.target.value))}
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

        {/* NEW IMAGES */}
        <div>
          <label className="block text-sm font-medium">Upload New Images</label>
          <input
            type="file"
            multiple
            onChange={handleImageChange}
            accept="image/*"
            className="mt-1"
          />
        </div>

        {/* EXISTING IMAGES */}
        {existingImages.length > 0 && (
          <div className="mt-3">
            <p className="font-semibold mb-1 text-sm">Existing Images:</p>
            <div className="grid grid-cols-3 gap-2">
              {existingImages.map((img, idx) => (
                <Image
                  key={idx}
                  src={img.url}
                  alt={`existing ${idx + 1}`}
                  width={100}
                  height={100}
                  className="object-cover rounded"
                />
              ))}
            </div>
          </div>
        )}

        {/* PREVIEW NEW IMAGES */}
        {previewImages.length > 0 && (
          <div className="mt-3">
            <p className="font-semibold mb-1 text-sm">New Image Preview:</p>
            <div className="grid grid-cols-3 gap-2">
              {previewImages.map((src, idx) => (
                <Image
                  key={idx}
                  src={src}
                  alt={`Preview ${idx + 1}`}
                  width={100}
                  height={100}
                  className="object-cover rounded"
                />
              ))}
            </div>
          </div>
        )}

        {/* SUBMIT BUTTON */}
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
