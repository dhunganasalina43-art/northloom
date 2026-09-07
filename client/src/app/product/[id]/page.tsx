"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { IProduct, IReview } from "@/types";
import { getProductById } from "@/services/product.service";
import { getProductReviews } from "@/services/review.service";
import { useCart } from "@/context/cart.context";
import { useWishlist } from "@/context/wishlist.context";
import { formatPrice } from "@/lib/currency";
import Button from "@/components/ui/Button";
import ReviewForm from "@/components/product/ReviewForm";
import ReviewList from "@/components/product/ReviewList";
import toast from "react-hot-toast";

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { addItem } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const [product, setProduct] = useState<IProduct | null>(null);
  const [reviews, setReviews] = useState<IReview[]>([]);
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

  const loadReviews = () => {
    getProductReviews(id).then((res) => setReviews(res.data));
  };

  useEffect(() => {
    getProductById(id)
      .then((res) => setProduct(res.data))
      .finally(() => setIsLoading(false));
    loadReviews();
  }, [id]);

  if (isLoading) return <p className="text-ink-900/60">Loading product...</p>;
  if (!product) return <p className="text-ink-900/60">Product not found.</p>;

  const category = typeof product.category === "object" ? product.category.name : "";
  const onSale = product.compare_at_price && product.compare_at_price > product.price;
  const saved = isInWishlist(product._id);

  const handleAddToCart = () => {
    if (product.sizes.length > 0 && !selectedSize) {
      toast.error("Please select a size");
      return;
    }
    if (product.colors.length > 0 && !selectedColor) {
      toast.error("Please select a color");
      return;
    }
    addItem(product._id, quantity, selectedSize || undefined, selectedColor || undefined);
  };

  return (
    <div>
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
          <div className="mt-2 flex items-start justify-between gap-4">
            <h1 className="font-serif text-3xl text-ink-900">{product.name}</h1>
            <button
              onClick={() => toggleWishlist(product._id)}
              className="text-2xl leading-none"
              aria-label={saved ? "Remove from wishlist" : "Save to wishlist"}
              title={saved ? "Remove from wishlist" : "Save to wishlist"}
            >
              {saved ? "♥" : "♡"}
            </button>
          </div>

          {product.rating_count > 0 && (
            <p className="mt-1 text-sm text-ink-900/60">
              <span className="text-weft-500">★</span> {product.rating_avg.toFixed(1)} ({product.rating_count} review{product.rating_count === 1 ? "" : "s"})
            </p>
          )}

          <div className="mt-3 flex items-center gap-3">
            <span className="text-xl font-semibold text-ink-900">{formatPrice(product.price)}</span>
            {onSale && (
              <span className="text-ink-900/40 line-through">{formatPrice(product.compare_at_price!)}</span>
            )}
          </div>

          <p className="mt-5 leading-relaxed text-ink-900/70">{product.description}</p>

          {product.sizes.length > 0 && (
            <div className="mt-5">
              <span className="mb-2 block text-sm font-medium text-ink-900">Size</span>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`rounded-sm border px-3 py-1.5 text-sm ${
                      selectedSize === size
                        ? "border-indigo-600 bg-indigo-600 text-white"
                        : "border-ink-900/20 text-ink-900 hover:border-ink-900/40"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {product.colors.length > 0 && (
            <div className="mt-5">
              <span className="mb-2 block text-sm font-medium text-ink-900">Color</span>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`rounded-sm border px-3 py-1.5 text-sm ${
                      selectedColor === color
                        ? "border-indigo-600 bg-indigo-600 text-white"
                        : "border-ink-900/20 text-ink-900 hover:border-ink-900/40"
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          )}

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

            <Button disabled={product.stock === 0} onClick={handleAddToCart}>
              Add to cart
            </Button>
          </div>
        </div>
      </div>

      <div className="mt-16 grid gap-10 md:grid-cols-2">
        <div>
          <h2 className="mb-4 font-serif text-xl text-ink-900">Reviews</h2>
          <ReviewList reviews={reviews} />
        </div>
        <div>
          <h2 className="mb-4 font-serif text-xl text-ink-900">Write a review</h2>
          <ReviewForm productId={product._id} onSubmitted={loadReviews} />
        </div>
      </div>
    </div>
  );
}
