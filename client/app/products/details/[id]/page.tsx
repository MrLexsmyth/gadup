"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { Playfair_Display } from "next/font/google";

import { useAuth } from "../../../../context/AuthContext";
import { useCart } from "../../../../context/CartContext";
import API from "../../../../lib/api"; // use your axios instance

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

interface Product {
  _id: string;
  name: string;
  images: { url: string; public_id: string }[]; // support multiple images
  price: number;
  discountPrice?: number; // added discount support
  category: string;
  description: string;
}

export default function ProductPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const { addToCart } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string>("");

  useEffect(() => {
    if (!id) return;

    const fetchProduct = async () => {
      try {
        const { data } = await API.get<Product>(`/products/${id}`);
        setProduct(data);
        if (data.images?.length) setSelectedImage(data.images[0].url);
      } catch (err) {
        console.error("Failed to fetch product:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (!user) {
      router.push(`/auth/login?redirect=/product/${id}`);
      return;
    }
    if (product) {
      setAddingToCart(true);
      const finalPrice = product.discountPrice ?? product.price;
      addToCart({ ...product, price: finalPrice, quantity: 1 });
      setAddingToCart(false);
    }
  };

  if (loading) return <p className="p-6 text-center">Loading product...</p>;
  if (!product) return <p className="p-6 text-center">Product not found.</p>;

  const finalPrice = product.discountPrice ?? product.price;
  const hasDiscount = product.discountPrice && product.discountPrice < product.price;
  const discountPercentage = hasDiscount
    ? Math.round(((product.price - product.discountPrice!) / product.price) * 100)
    : 0;

  return (
    <div className={playfair.className + " max-w-6xl mx-auto p-6 flex flex-col md:flex-row gap-6"}>
      {/* Product Images */}
      <div className="flex flex-col md:w-1/2 gap-4">
        {/* Main Image */}
        <div className="relative w-full h-80 md:h-[500px] bg-gray-100 rounded-lg overflow-hidden">
          <Image
            src={selectedImage || "/placeholder.png"}
            alt={product.name}
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Thumbnails */}
        <div className="flex gap-2 overflow-x-auto mt-2">
          {product.images.map((img, idx) => (
            <div
              key={idx}
              className={`w-20 h-20 rounded overflow-hidden border ${
                selectedImage === img.url ? "border-[#00817c]" : "border-gray-300"
              } cursor-pointer`}
              onClick={() => setSelectedImage(img.url)}
            >
              <Image
                src={img.url}
                alt={`Thumbnail ${idx + 1}`}
                width={80}
                height={80}
                className="object-cover"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Product Details */}
      <div className="flex-1 flex flex-col">
        <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
        <p className="text-gray-500 mb-4 capitalize">{product.category}</p>

        {hasDiscount ? (
          <div className="flex items-center gap-3 mb-4">
            <p className="text-red-600 font-bold text-2xl">₦{finalPrice.toLocaleString()}</p>
            <p className="text-gray-400 line-through">₦{product.price.toLocaleString()}</p>
            <p className="text-green-600 font-semibold">-{discountPercentage}%</p>
          </div>
        ) : (
          <p className="text-red-600 font-bold text-2xl mb-4">₦{finalPrice.toLocaleString()}</p>
        )}

        <div
          className="text-gray-700 mb-6"
          dangerouslySetInnerHTML={{ __html: product.description }}
        ></div>

        <button
          onClick={handleAddToCart}
          disabled={addingToCart}
          className="w-full md:w-auto bg-[#00817c] text-white py-3 px-6 rounded hover:bg-[#006c65] transition mb-4"
        >
          {addingToCart ? "Adding..." : "Add to Cart"}
        </button>

        <button
          onClick={() => router.back()}
          className="w-full md:w-auto text-[#00817c] py-2 px-4 rounded border border-[#00817c] hover:bg-[#00817c]/10 transition"
        >
          Back to Products
        </button>
      </div>
    </div>
  );
}
