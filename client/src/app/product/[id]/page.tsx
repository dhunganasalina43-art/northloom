"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { IProduct } from "@/types";
import { getProductById } from "@/services/product.service";
import { useCart } from "@/context/cart.context";
import Button from "@/components/ui/Button";

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { addItem } = useCart();

  const [product, setProduct] = useState<IProduct | null>(null);
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getProductById(id)
      .then((res) => setProduct(res.data))
      .finally(() => setIsLoading(false));
  }, [id]);

  if (isLoading) return <p className="text-ink-900/60">Loading product...</p>;
  if (!product) return <p className="text-ink-900/60">Product not found.</p>;

  const category = typeof product.category === "object" ? product.category.name : "";
  const onSale = product.compare_at_price && product.compare_at_price > product.price;

  return (
    <div className="grid gap-10 md:grid-cols-2">
      <div>
        <div className="relative aspect-square overflow-hidden rounded-sm bg-linen-100">
          {product.images[activeImage] && (
            <Image src={product.images[activeImage].url} alt={product.name} fill className="object-cover" />
          )}
        </div>
        {product.images.length > 1 && (
          <div className="mt-3 flex gap-2">
            {product.images.map((img, i) => (
              <button
                key={img.public_id}
                onClick={() => setActiveImage(i)}
                className={`relative h-16 w-16 overflow-hidden rounded-sm border ${
                  i === activeImage ? "border-indigo-600" : "border-transparent"
                }`}
              >
                <Image src={img.url} alt="" fill className="object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      <div>
        {category && (
          <p className="text-xs font-medium uppercase tracking-[0.15em] text-weft-600">{category}</p>
        )}
        <h1 className="mt-2 font-serif text-3xl text-ink-900">{product.name}</h1>

        <div className="mt-3 flex items-center gap-3">
          <span className="text-xl font-semibold text-ink-900">${product.price.toFixed(2)}</span>
          {onSale && (
            <span className="text-ink-900/40 line-through">${product.compare_at_price!.toFixed(2)}</span>
          )}
        </div>

        <p className="mt-5 leading-relaxed text-ink-900/70">{product.description}</p>

        <p className="mt-4 text-sm text-ink-900/60">
          {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
        </p>

        <div className="mt-6 flex items-center gap-4">
          <div className="flex items-center rounded-sm border border-ink-900/20">
            <button
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="px-3 py-2 text-sm"
              aria-label="Decrease quantity"
            >
              −
            </button>
            <span className="w-8 text-center text-sm">{quantity}</span>
            <button
              onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
              className="px-3 py-2 text-sm"
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>

          <Button
            disabled={product.stock === 0}
            onClick={() => addItem(product._id, quantity)}
          >
            Add to cart
          </Button>
        </div>
      </div>
    </div>
  );
}
