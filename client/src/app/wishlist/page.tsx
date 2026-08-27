"use client";

import Link from "next/link";
import { useWishlist } from "@/context/wishlist.context";
import withAuth from "@/hoc/withAuth";
import ProductGrid from "@/components/product/ProductGrid";

function WishlistPage() {
  const { wishlist, isLoading } = useWishlist();

  return (
    <div>
      <h1 className="font-serif text-3xl text-ink-900">Your wishlist</h1>
      <div className="thread-rule my-4 w-16" />

      {isLoading ? (
        <p className="text-ink-900/60">Loading your wishlist...</p>
      ) : !wishlist || wishlist.products.length === 0 ? (
        <div className="py-16 text-center">
          <p className="text-ink-900/60">Nothing saved yet.</p>
          <Link href="/shop" className="mt-4 inline-block text-indigo-600 hover:text-indigo-700">
            Browse the shop →
          </Link>
        </div>
      ) : (
        <ProductGrid products={wishlist.products} />
      )}
    </div>
  );
}

export default withAuth(WishlistPage);