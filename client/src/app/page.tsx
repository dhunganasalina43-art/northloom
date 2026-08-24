import Link from "next/link";
import Image from "next/image";
import api from "@/lib/api";
import { IApiResponse, ICategory, IProduct } from "@/types";
import ProductGrid from "@/components/product/ProductGrid";

async function getHomeData() {
  const [featuredRes, categoriesRes] = await Promise.all([
    api.get<IApiResponse<IProduct[]>>("/products/featured"),
    api.get<IApiResponse<ICategory[]>>("/categories"),
  ]);
  return { featured: featuredRes.data.data, categories: categoriesRes.data.data };
}

export default async function HomePage() {
  const { featured, categories } = await getHomeData();

  return (
    <div>
      {/* Hero */}
      <section className="grid gap-10 py-10 md:grid-cols-2 md:items-center">
        <div>
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-weft-600">
            New season textiles
          </p>
          <h1 className="font-serif text-5xl leading-tight text-ink-900">
            Good rooms are woven, <br /> not decorated.
          </h1>
          <p className="mt-5 max-w-md text-ink-900/70">
            Northloom sources linen, stoneware, and quiet furniture made to be used daily
            and to age well — no trend pieces, no landfill decor.
          </p>
          <Link
            href="/shop"
            className="mt-8 inline-block rounded-sm bg-indigo-600 px-6 py-3 text-sm font-medium text-white hover:bg-indigo-700"
          >
            Shop the collection
          </Link>
        </div>
        <div className="thread-rule hidden md:block" />
      </section>

      {/* Categories */}
      <section className="py-10">
        <h2 className="font-serif text-2xl text-ink-900">Shop by category</h2>
        <div className="thread-rule my-4 w-16" />
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {categories.map((c) => (
            <Link
              key={c._id}
              href={`/shop?category=${c._id}`}
              className="group relative aspect-[4/3] overflow-hidden rounded-sm bg-linen-100"
            >
              {c.image?.url && (
                <Image src={c.image.url} alt={c.name} fill className="object-cover transition-transform group-hover:scale-105" />
              )}
              <span className="absolute bottom-0 left-0 bg-ink-900/70 px-3 py-1.5 text-sm text-white">
                {c.name}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured products */}
      <section className="py-10">
        <h2 className="font-serif text-2xl text-ink-900">Featured products</h2>
        <div className="thread-rule my-4 w-16" />
        <ProductGrid products={featured} />
      </section>
    </div>
  );
}
