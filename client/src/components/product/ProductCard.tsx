import Image from "next/image";
import Link from "next/link";
import { IProduct } from "@/types";

/** Storefront grid tile: image, name, price, and a link to the detail page. */
export default function ProductCard({ product }: { product: IProduct }) {
  const image = product.images?.[0]?.url;
  const onSale = product.compare_at_price && product.compare_at_price > product.price;

  return (
    <Link href={`/product/${product._id}`} className="group block">
      <div className="relative aspect-square overflow-hidden rounded-sm bg-linen-100">
        {image ? (
          <Image
            src={image}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-ink-900/30">No image</div>
        )}
        {onSale && (
          <span className="absolute left-2 top-2 rounded-sm bg-weft-500 px-2 py-0.5 text-xs text-white">
            Sale
          </span>
        )}
      </div>
      <div className="mt-3">
        <h3 className="text-sm font-medium text-ink-900">{product.name}</h3>
        <div className="mt-1 flex items-center gap-2 text-sm">
          <span className="font-semibold text-ink-900">${product.price.toFixed(2)}</span>
          {onSale && (
            <span className="text-ink-900/40 line-through">${product.compare_at_price!.toFixed(2)}</span>
          )}
        </div>
      </div>
    </Link>
  );
}
