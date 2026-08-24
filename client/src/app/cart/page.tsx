"use client";

import Link from "next/link";
import { useCart } from "@/context/cart.context";
import CartItemRow from "@/components/cart/CartItemRow";
import Button from "@/components/ui/Button";

export default function CartPage() {
  const { cart, isLoading } = useCart();

  const subtotal = cart?.items.reduce((sum, i) => sum + i.product.price * i.quantity, 0) || 0;

  if (isLoading) return <p className="text-ink-900/60">Loading your cart...</p>;

  if (!cart || cart.items.length === 0) {
    return (
      <div className="py-20 text-center">
        <h1 className="font-serif text-2xl text-ink-900">Your cart is empty</h1>
        <p className="mt-2 text-ink-900/60">Browse the shop to find something for your home.</p>
        <Link href="/shop" className="mt-6 inline-block text-indigo-600 hover:text-indigo-700">
          Continue shopping →
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h1 className="font-serif text-3xl text-ink-900">Your cart</h1>
      <div className="thread-rule my-4 w-16" />

      <div className="grid gap-10 md:grid-cols-3">
        <div className="md:col-span-2">
          {cart.items.map((item) => (
            <CartItemRow key={item._id} item={item} />
          ))}
        </div>

        <div className="h-fit rounded-sm border border-ink-900/10 bg-linen-100 p-6">
          <h2 className="font-serif text-lg text-ink-900">Order summary</h2>
          <div className="mt-4 flex justify-between text-sm text-ink-900/70">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <p className="mt-1 text-xs text-ink-900/50">Shipping is calculated at checkout.</p>
          <Link href="/checkout" className="mt-6 block">
            <Button className="w-full">Proceed to checkout</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
