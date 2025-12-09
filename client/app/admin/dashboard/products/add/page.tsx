"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { EditorContent, useEditor, Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import ImageExtension from "@tiptap/extension-image";
import API from "../../../../../lib/api"; // centralized axios instance

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

  const [image, setImage] = useState<File | null>(null);
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

  const uploadImage = async () => {
    if (!image) {
      alert("Please select an image");
      return null;
    }
    const formDataObj = new FormData();
    formDataObj.append("image", image);

    const { data } = await API.post("/upload", formDataObj, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return data; // { url, public_id }
  };

  const insertLocalImage = async (file: File) => {
    const formDataObj = new FormData();
    formDataObj.append("image", file);

    try {
      const { data } = await API.post("/upload", formDataObj, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (editor) editor.chain().focus().setImage({ src: data.url }).run();
    } catch (err) {
      alert("Failed to upload image for editor");
      console.error(err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const imageData = await uploadImage();
      if (!imageData) return;

      await API.post("/products", {
        ...formData,
        price: parseFloat(formData.price),
        discountPrice: parseFloat(formData.discountPrice) || 0,
        imageUrl: imageData.url,
        imagePublicId: imageData.public_id,
      });

      alert("✅ Product added successfully!");
      router.push("/admin/dashboard/products");
    } catch (err) {
      if (err instanceof Error) alert(err.message);
      else alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Add New Product</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="name"
          placeholder="Product name"
          value={formData.name}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />

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

        <div className="border rounded">{editor && <EditorContent editor={editor} />}</div>

        <input
          type="number"
          name="price"
          placeholder="Price"
          value={formData.price}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />

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

        <input
          name="brand"
          placeholder="Brand"
          value={formData.brand}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />

        <input
          type="number"
          name="stock"
          placeholder="Stock quantity"
          value={formData.stock}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="isFeatured"
            checked={formData.isFeatured}
            onChange={handleChange}
          />
          <span>Featured product</span>
        </label>

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files?.[0] || null)}
          className="w-full border p-2 rounded"
        />

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
