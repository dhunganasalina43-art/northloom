
"use client";

import { Toaster } from "react-hot-toast";

import { AuthProvider } from "@/context/auth.context";

import { CartProvider } from "@/context/cart.context";

import { WishlistProvider } from "@/context/wishlist.context";

export default function Providers({ children }: { children: React.ReactNode }) {

  return (

    <AuthProvider>

      <CartProvider>

        <WishlistProvider>

          {children}

          <Toaster position="top-center" toastOptions={{ duration: 3000 }} />

        </WishlistProvider>

      </CartProvider>

    </AuthProvider>

  );

}

