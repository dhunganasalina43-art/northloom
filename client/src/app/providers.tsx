"use client";

import { Toaster } from "react-hot-toast";
import { AuthProvider } from "@/context/auth.context";
import { CartProvider } from "@/context/cart.context";

/** Wraps the whole app in the context providers every page needs. */
export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <CartProvider>
        {children}
        <Toaster position="top-center" toastOptions={{ duration: 3000 }} />
      </CartProvider>
    </AuthProvider>
  );
}
