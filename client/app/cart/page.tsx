"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface CartProduct {
  _id: string;
  name: string;
  price: number;
  image?: { url: string };
  quantity: number;
}

export default function CartPage() {
  const [cart, setCart] = useState<CartProduct[]>([]);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedCart = JSON.parse(localStorage.getItem("cart") || "[]");
      setCart(storedCart);
    }
  }, []);

  // Update quantity
  const updateQuantity = (id: string, qty: number) => {
    const updatedCart = cart.map((item) =>
      item._id === id ? { ...item, quantity: qty } : item
    );
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  // Remove item
  const removeItem = (id: string) => {
    const updatedCart = cart.filter((item) => item._id !== id);
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  // Total price
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (!cart.length) return <p className="p-6 text-center">Your cart is empty.</p>;

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-6">Your Cart</h1>

      <div className="flex flex-col gap-6">
        {cart.map((item) => (
          <div
            key={item._id}
            className="flex items-center gap-4 border rounded p-4 shadow-sm"
          >
            <div className="relative w-24 h-24 flex-shrink-0">
              <Image
                src={item.image?.url || "/placeholder.jpg"}
                alt={item.name}
                fill
                className="object-cover rounded"
              />
            </div>

            <div className="flex-1">
              <h3 className="font-semibold">{item.name}</h3>
              <p className="text-red-600 font-semibold">
                ₦{Number(item.price).toLocaleString()}
              </p>

              <div className="flex items-center gap-2 mt-2">
                <button
                  className="px-2 py-1 bg-gray-200 rounded"
                  onClick={() =>
                    updateQuantity(item._id, Math.max(1, item.quantity - 1))
                  }
                >
                  -
                </button>
                <span>{item.quantity}</span>
                <button
                  className="px-2 py-1 bg-gray-200 rounded"
                  onClick={() => updateQuantity(item._id, item.quantity + 1)}
                >
                  +
                </button>
                <button
                  className="ml-4 px-2 py-1 bg-red-600 text-white rounded"
                  onClick={() => removeItem(item._id)}
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 flex justify-between items-center">
        <p className="text-xl font-semibold">Total: ₦{totalPrice.toLocaleString()}</p>
         <Link href="/checkout" passHref>
  <button
    className="w-full bg-[#008080] cursor-pointer text-white mb-4 py-2 rounded transition-colors hover:bg-teal-700"
  >
    Proceed to Checkout
  </button>
</Link>
        
      </div>
    </div>
  );
}
