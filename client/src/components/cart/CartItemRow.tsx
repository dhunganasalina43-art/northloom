"use client";

import Image from "next/image";
import { ICartItem } from "@/types";
import { useCart } from "@/context/cart.context";

export default function CartItemRow({ item }: { item: ICartItem }) {
  const { updateItem, removeItem } = useCart();
  const product = item.product;
  const image = product.images?.[0]?.url;

  return (
    <div className="flex items-center gap-4 border-b border-ink-900/10 py-4">
      <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-sm bg-linen-100">
        {image && <Image src={image} alt={product.name} fill className="object-cover" />}
      </div>

      <div className="flex-1">
        <p className="text-sm font-medium text-ink-900">{product.name}</p>
        <p className="mt-1 text-sm text-ink-900/60">${product.price.toFixed(2)}</p>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => updateItem(item._id, Math.max(1, item.quantity - 1))}
          className="h-7 w-7 rounded-sm border border-ink-900/20 text-sm hover:bg-linen-100"
          aria-label="Decrease quantity"
        >
          −
        </button>
        <span className="w-6 text-center text-sm">{item.quantity}</span>
        <button
          onClick={() => updateItem(item._id, item.quantity + 1)}
          className="h-7 w-7 rounded-sm border border-ink-900/20 text-sm hover:bg-linen-100"
          aria-label="Increase quantity"
        >
          +
        </button>
      </div>

      <p className="w-20 text-right text-sm font-medium text-ink-900">
        ${(product.price * item.quantity).toFixed(2)}
      </p>

      <button
        onClick={() => removeItem(item._id)}
        className="text-sm text-weft-600 hover:text-weft-600/80"
      >
        Remove
      </button>
    </div>
  );
}
