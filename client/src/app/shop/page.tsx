"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { getProducts } from "@/services/product.service";
import { getCategories } from "@/services/category.service";
import { ICategory, IProduct } from "@/types";
import ProductGrid from "@/components/product/ProductGrid";
import ProductFilters from "@/components/product/ProductFilters";

/**
 * Shop / product listing page. Reads filters from the URL (?q=&category=&sort=)
 * so links from the home page and search bar work, and keeps the URL in sync
 * whenever the shopper changes a filter.
 */
export default function ShopPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [products, setProducts] = useState<IProduct[]>([]);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const q = searchParams.get("q") || "";
  const category = searchParams.get("category") || "";
  const sort = searchParams.get("sort") || "newest";

  useEffect(() => {
    getCategories().then((res) => setCategories(res.data));
  }, []);

  useEffect(() => {
    setIsLoading(true);
    getProducts({ q: q || undefined, category: category || undefined, sort: sort as any })
      .then((res) => setProducts(res.data))
      .finally(() => setIsLoading(false));
  }, [q, category, sort]);

  const updateParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    router.push(`/shop?${params.toString()}`);
  };

  return (
    <div>
      <h1 className="font-serif text-3xl text-ink-900">
        {q ? `Results for "${q}"` : "All products"}
      </h1>
      <div className="thread-rule my-4 w-16" />

      <div className="mb-8">
        <ProductFilters
          categories={categories}
          selectedCategory={category}
          sort={sort}
          onCategoryChange={(id) => updateParam("category", id)}
          onSortChange={(s) => updateParam("sort", s)}
        />
      </div>

      {isLoading ? (
        <p className="text-ink-900/60">Loading products...</p>
      ) : (
        <ProductGrid products={products} />
      )}
    </div>
  );
}
