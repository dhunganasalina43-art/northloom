"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { ICart } from "@/types";
import { addCartItem, getCart, removeCartItem, updateCartItem } from "@/services/cart.service";
import { useAuth } from "./auth.context";
import toast from "react-hot-toast";

type TCartContext = {
  cart: ICart | null;
  itemCount: number;
  isLoading: boolean;
  addItem: (productId: string, quantity?: number) => Promise<void>;
  updateItem: (itemId: string, quantity: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  refreshCart: () => Promise<void>;
};

const CartContext = createContext<TCartContext | undefined>(undefined);

/** Loads the logged-in user's cart and exposes add/update/remove actions used across the storefront. */
export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState<ICart | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const refreshCart = useCallback(async () => {
    if (!user) {
      setCart(null);
      return;
    }
    setIsLoading(true);
    try {
      const res = await getCart();
      setCart(res.data);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  const addItem = async (productId: string, quantity = 1) => {
    if (!user) {
      toast.error("Please log in to add items to your cart");
      return;
    }
    try {
      const res = await addCartItem(productId, quantity);
      setCart(res.data);
      toast.success("Added to cart");
    } catch (err: any) {
      toast.error(err?.message || "Could not add item to cart");
    }
  };

  const updateItem = async (itemId: string, quantity: number) => {
    try {
      const res = await updateCartItem(itemId, quantity);
      setCart(res.data);
    } catch (err: any) {
      toast.error(err?.message || "Could not update quantity");
    }
  };

  const removeItem = async (itemId: string) => {
    const res = await removeCartItem(itemId);
    setCart(res.data);
  };

  const itemCount = cart?.items.reduce((sum, i) => sum + i.quantity, 0) || 0;

  return (
    <CartContext.Provider value={{ cart, itemCount, isLoading, addItem, updateItem, removeItem, refreshCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
};
