import { IProduct } from "@/types";
import ProductCard from "./ProductCard";

export default function ProductGrid({ products }: { products: IProduct[] }) {
  if (products.length === 0) {
    return <p className="py-16 text-center text-ink-900/60">No products match your search yet.</p>;
  }
  return (
    <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
      {products.map((p) => (
        <ProductCard key={p._id} product={p} />
      ))}
    </div>
  );
}
