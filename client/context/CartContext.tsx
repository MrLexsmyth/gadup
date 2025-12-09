"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface CartItem {
  _id: string;
  name: string;
  price: number;            // original price
  discountPrice?: number;   // optional discounted price
  category: string;
  image?: { url: string };
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  cartCount: number;
  updateQuantity: (id: string, newQty: number) => void;
  cartTotal: number;
}

const CartContext = createContext<CartContextType>({
  cart: [],
  addToCart: () => {},
  removeFromCart: () => {},
  clearCart: () => {},
  cartCount: 0,
  updateQuantity: () => {},
  cartTotal: 0,
});

export const CartProvider = ({ children }: { children: ReactNode }) => {
  // Lazy initialize cart from localStorage
  const [cart, setCart] = useState<CartItem[]>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("cart");
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) return parsed;
        } catch (err) {
          console.error("Failed to parse cart from localStorage:", err);
        }
      }
    }
    return [];
  });

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("cart", JSON.stringify(cart));
    }
  }, [cart]);

  // Add item to cart
  const addToCart = (item: CartItem) => {
    const priceToUse =
      item.discountPrice && item.discountPrice < item.price
        ? item.discountPrice
        : item.price;

    setCart((prev) => {
      const exists = prev.find((i) => i._id === item._id);
      if (exists) {
        return prev.map((i) =>
          i._id === item._id
            ? { ...i, quantity: i.quantity + 1, price: priceToUse }
            : i
        );
      } else {
        return [...prev, { ...item, quantity: 1, price: priceToUse }];
      }
    });
  };

  // Remove item from cart
  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((item) => item._id !== id));
  };

  // Clear cart
  const clearCart = () => {
    setCart([]);
    if (typeof window !== "undefined") {
      localStorage.removeItem("cart");
    }
  };

  // Update quantity of a cart item
  const updateQuantity = (id: string, newQty: number) => {
    setCart((prevCart) =>
      prevCart.map((item) => {
        if (item._id === id) {
          const priceToUse =
            item.discountPrice && item.discountPrice < item.price
              ? item.discountPrice
              : item.price;
          return { ...item, quantity: Math.max(newQty, 1), price: priceToUse };
        }
        return item;
      })
    );
  };

  // Total items count
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  // Total cart price (respecting discount price)
  const cartTotal = cart.reduce((acc, item) => {
    const priceToUse =
      item.discountPrice && item.discountPrice < item.price
        ? item.discountPrice
        : item.price;
    return acc + priceToUse * item.quantity;
  }, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        clearCart,
        cartCount,
        updateQuantity,
        cartTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
