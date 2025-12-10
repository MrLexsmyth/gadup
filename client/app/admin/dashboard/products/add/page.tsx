"use client";

import { AxiosError } from "axios";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { EditorContent, useEditor, Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import ImageExtension from "@tiptap/extension-image";
import API from "../../../../../lib/api";

interface ProductForm {
  name: string;
  description: string;
  price: string;
  discountPrice: string;
  category: string;
  brand: string;
  stock: string;
  isFeatured: boolean;
}

export default function AddProductPage() {
  const router = useRouter();

  const [formData, setFormData] = useState<ProductForm>({
    name: "",
    description: "",
    price: "",
    discountPrice: "",
    category: "fashion",
    brand: "",
    stock: "",
    isFeatured: false,
  });

  const [images, setImages] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);

  const editor: Editor | null = useEditor({
    extensions: [StarterKit, Link, ImageExtension],
    content: "",
    onUpdate: ({ editor }) =>
      setFormData((prev) => ({ ...prev, description: editor.getHTML() })),
    editorProps: {
      attributes: { class: "prose p-2 border rounded min-h-[150px]" },
    },
    immediatelyRender: false,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, type, value, checked } = e.target as HTMLInputElement;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const insertLocalImage = async (file: File) => {
    const formDataObj = new FormData();
    formDataObj.append("images", file);

    try {
      const { data } = await API.post("/upload", formDataObj, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (editor) editor.chain().focus().setImage({ src: data.images[0].url }).run();
    } catch (err) {
      alert("Failed to upload image for editor");
      console.error(err);
    }
  };

  // Upload all product images to /upload
  const uploadImages = async () => {
    if (images.length === 0) {
      alert("Please select at least one product image.");
      return [];
    }

    const formDataObj = new FormData();
    images.forEach((img) => formDataObj.append("images", img));

    try {
      const { data } = await API.post("/upload", formDataObj, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return data.images; // [{ url, public_id }]
    } catch (err) {
      console.error("Image upload error:", err);
      alert("Failed to upload product images");
      return [];
    }
  };

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);

  try {
    const uploadedImages = await uploadImages();
    if (uploadedImages.length === 0) return;

    await API.post("/products", {
      ...formData,
      price: Number(formData.price),
      discountPrice: Number(formData.discountPrice) || 0,
      images: uploadedImages,
    });

    alert("✅ Product added successfully!");
    router.push("/admin/dashboard/products");
  } catch (error: unknown) {
    let message = "Something went wrong";

    // Type guard for AxiosError
    if (error instanceof AxiosError) {
      message = error.response?.data?.message || message;
    } else if (error instanceof Error) {
      message = error.message;
    }

    console.error("PRODUCT CREATE ERROR:", error);
    alert(message);
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Add New Product</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* NAME */}
        <input
          name="name"
          placeholder="Product name"
          value={formData.name}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />

        {/* IMAGE INSERT FOR DESCRIPTION */}
        <label className="block mb-2">
          Insert Image in Description:
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) insertLocalImage(file);
            }}
            className="mt-1"
          />
        </label>

        {/* TIPTAP EDITOR */}
        <div className="border rounded">
          {editor && <EditorContent editor={editor} />}
        </div>

        {/* PRICE */}
        <input
          type="number"
          name="price"
          placeholder="Price"
          value={formData.price}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />

        {/* DISCOUNT PRICE */}
        <input
          type="number"
          name="discountPrice"
          placeholder="Discount Price (optional)"
          value={formData.discountPrice}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          min={0}
          max={parseFloat(formData.price) || undefined}
        />

        {/* CATEGORY */}
        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        >
          <option value="fashion">Fashion</option>
          <option value="electronics">Electronics</option>
          <option value="phones">Phones</option>
          <option value="toys">Toys</option>
          <option value="laptops">Laptops</option>
          <option value="gaming">Gaming Accessories</option>
          <option value="accessories">General Accessories</option>
        </select>

        {/* BRAND */}
        <input
          name="brand"
          placeholder="Brand"
          value={formData.brand}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />

        {/* STOCK */}
        <input
          type="number"
          name="stock"
          placeholder="Stock quantity"
          value={formData.stock}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />

        {/* FEATURED */}
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="isFeatured"
            checked={formData.isFeatured}
            onChange={handleChange}
          />
          <span>Featured product</span>
        </label>

        {/* MULTIPLE IMAGES */}
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={(e) =>
            setImages(e.target.files ? Array.from(e.target.files) : [])
          }
          className="w-full border p-2 rounded"
        />

        {/* IMAGE PREVIEWS */}
        {images.length > 0 && (
          <div className="flex gap-2 mt-2 overflow-x-auto">
            {images.map((img, idx) => (
              <div key={idx} className="relative h-28 w-40 flex-shrink-0">
                <Image
                  src={URL.createObjectURL(img)}
                  alt={`preview ${idx + 1}`}
                  fill
                  className="object-cover rounded"
                />
              </div>
            ))}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white py-2 px-4 rounded w-full"
        >
          {loading ? "Uploading..." : "Add Product"}
        </button>
      </form>
    </div>
  );
}
