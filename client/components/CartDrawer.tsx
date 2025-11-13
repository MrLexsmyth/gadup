"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "../context/CartContext";
import { Playfair_Display } from "next/font/google";
import { X, Trash2, Plus, Minus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export default function CartDrawer({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const { cart, removeFromCart, clearCart, updateQuantity, cartCount } = useCart();

  // Calculate total price
  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
   <AnimatePresence>
  {isOpen && (
    <>
      {/* Backdrop */}
      <motion.div
        className="fixed inset-0 bg-black/50 z-40"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />

      {/* Drawer */}
      <motion.div
        className={`fixed top-0 right-0 h-full bg-white shadow-lg z-50 flex flex-col ${playfair.className}
                    w-[90%] sm:w-[400px] md:w-[450px] lg:w-[500px]`}
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "tween", duration: 0.3 }}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-semibold">
            Your Cart ({cartCount})
          </h2>
          <button onClick={onClose}>
            <X className="w-6 h-6 text-gray-700" />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
              <Image
                src="/sad.webp"
                alt="Empty Cart"
                width={140}
                height={250}
                className="object-contain mb-4"
              />
              <h2 className="text-2xl sm:text-3xl font-semibold text-gray-800 mb-2">
                Your cart is empty
              </h2>
              <p className="text-gray-500 mb-6 text-sm sm:text-base">
                You have no items in your cart. Shop now to add your favorite products!
              </p>
              <Link href="/products/category">
                <button className="bg-[#03686d] text-white px-8 sm:px-12 py-2 hover:bg-[#024c50] transition-colors duration-200 rounded">
                  Start Shopping
                </button>
              </Link>
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={item._id}
                className="flex items-center justify-between gap-3 border-b pb-3"
              >
                {/* Product Image */}
                {item.image?.url && (
                  <Image
                    src={item.image.url}
                    alt={item.name}
                    width={70}
                    height={70}
                    className="rounded-md object-cover"
                  />
                )}

                {/* Product Info */}
                <div className="flex-1">
                  <p className="font-medium text-sm sm:text-base">
                    {item.name.length > 25
                      ? item.name.slice(0, 25) + "..."
                      : item.name}
                  </p>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-2 mt-1">
                    <button
                      className="border rounded-full w-6 h-6 flex items-center justify-center text-gray-600 hover:bg-gray-100"
                      onClick={() =>
                        updateQuantity(item._id, item.quantity - 1)
                      }
                      disabled={item.quantity <= 1}
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="font-medium">{item.quantity}</span>
                    <button
                      className="border rounded-full w-6 h-6 flex items-center justify-center text-gray-600 hover:bg-gray-100"
                      onClick={() =>
                        updateQuantity(item._id, item.quantity + 1)
                      }
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-sm text-gray-500">
                    ₦{item.price.toLocaleString()} × {item.quantity}
                  </p>
                  <p className="font-semibold text-gray-800">
                    ₦{(item.price * item.quantity).toLocaleString()}
                  </p>
                  <button
                    className="text-red-600 hover:text-red-800 transition-colors duration-200 mt-1"
                    onClick={() => removeFromCart(item._id)}
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="p-4 border-t space-y-3">
            <div className="flex justify-between items-center font-semibold text-lg">
              <span>Total:</span>
              <span>₦{total.toLocaleString()}.00</span>
            </div>

            <Link href="/checkout" passHref>
              <button className="w-full bg-[#008080] cursor-pointer text-white py-2 rounded transition-colors hover:bg-teal-700">
                Proceed to Checkout
              </button>
            </Link>

            <button
              className="w-full bg-red-600 cursor-pointer text-white py-2 rounded hover:bg-red-700 transition-colors"
              onClick={clearCart}
            >
              Clear Cart
            </button>
          </div>
        )}
      </motion.div>
    </>
  )}
</AnimatePresence>

  );
}
