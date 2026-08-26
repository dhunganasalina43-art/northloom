"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { IWishlist } from "@/types";
import { getWishlist, addToWishlist, removeFromWishlist } from "@/services/wishlist.service";
import { useAuth } from "./auth.context";
import toast from "react-hot-toast";

type TWishlistContext = {
  wishlist: IWishlist | null;
  isLoading: boolean;
  isInWishlist: (productId: string) => boolean;
  toggleWishlist: (productId: string) => Promise<void>;
};

const WishlistContext = createContext<TWishlistContext | undefined>(undefined);

export const WishlistProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const [wishlist, setWishlist] = useState<IWishlist | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const refreshWishlist = useCallback(async () => {
    if (!user) {
      setWishlist(null);
      return;
    }
    setIsLoading(true);
    try {
      const res = await getWishlist();
      setWishlist(res.data);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    refreshWishlist();
  }, [refreshWishlist]);

  const isInWishlist = (productId: string) =>
    !!wishlist?.products.some((p) => p._id === productId);

  const toggleWishlist = async (productId: string) => {
    if (!user) {
      toast.error("Please log in to save items to your wishlist");
      return;
    }
    try {
      if (isInWishlist(productId)) {
        const res = await removeFromWishlist(productId);
        setWishlist(res.data);
        toast.success("Removed from wishlist");
      } else {
        const res = await addToWishlist(productId);
        setWishlist(res.data);
        toast.success("Saved to wishlist");
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Could not update wishlist");
    }
  };

  return (
    <WishlistContext.Provider value={{ wishlist, isLoading, isInWishlist, toggleWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used within a WishlistProvider");
  return ctx;
};