"use client";

import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/context/auth.context";
import { useCart } from "@/context/cart.context";

/**
 * Sticky top navigation: brand mark, primary links, search, cart badge,
 * and an account menu that changes depending on auth/role state.
 */
export default function Navbar() {
  const { user, logout } = useAuth();
  const { itemCount } = useCart();
  const [query, setQuery] = useState("");

  return (
    <header className="sticky top-0 z-40 border-b border-ink-900/10 bg-linen-50/95 backdrop-blur">
      <div className="thread-rule" />
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-4 py-4">
        <Link href="/" className="font-serif text-2xl font-semibold tracking-tight text-ink-900">
          Northloom
        </Link>

        <nav className="hidden gap-6 text-sm font-medium text-ink-900/80 md:flex">
          <Link href="/" className="hover:text-indigo-600">Home</Link>
          <Link href="/shop" className="hover:text-indigo-600">Shop</Link>
        </nav>

        <form
          action="/shop"
          className="hidden flex-1 max-w-sm items-center md:flex"
        >
          <input
            name="q"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products..."
            className="w-full rounded-sm border border-ink-900/20 bg-white px-3 py-1.5 text-sm focus:border-indigo-500"
          />
        </form>

        <div className="flex items-center gap-4 text-sm">
          <Link href="/cart" className="relative font-medium text-ink-900 hover:text-indigo-600">
            Cart
            {itemCount > 0 && (
              <span className="absolute -right-3 -top-2 rounded-full bg-weft-500 px-1.5 text-xs text-white">
                {itemCount}
              </span>
            )}
          </Link>

          {user ? (
            <div className="group relative">
              <button className="font-medium text-ink-900">{user.full_name.split(" ")[0]}</button>
              <div className="invisible absolute right-0 mt-2 w-44 rounded-sm border border-ink-900/10 bg-white py-1 shadow-lg group-hover:visible">
                <Link href="/account" className="block px-4 py-2 text-sm hover:bg-linen-100">Account</Link>
                <Link href="/orders" className="block px-4 py-2 text-sm hover:bg-linen-100">Orders</Link>
                {user.role === "admin" && (
                  <Link href="/admin" className="block px-4 py-2 text-sm hover:bg-linen-100">Admin dashboard</Link>
                )}
                <button
                  onClick={() => logout()}
                  className="block w-full px-4 py-2 text-left text-sm text-weft-600 hover:bg-linen-100"
                >
                  Log out
                </button>
              </div>
            </div>
          ) : (
            <Link href="/login" className="font-medium text-indigo-600 hover:text-indigo-700">
              Log in
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
