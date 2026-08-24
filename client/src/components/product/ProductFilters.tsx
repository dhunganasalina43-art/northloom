"use client";

import { ICategory } from "@/types";

type Props = {
  categories: ICategory[];
  selectedCategory: string;
  sort: string;
  onCategoryChange: (id: string) => void;
  onSortChange: (sort: string) => void;
};

/** Sidebar/topbar filter controls for the shop page: category + sort. */
export default function ProductFilters({
  categories,
  selectedCategory,
  sort,
  onCategoryChange,
  onSortChange,
}: Props) {
  return (
    <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => onCategoryChange("")}
          className={`rounded-sm border px-3 py-1.5 text-sm ${
            selectedCategory === "" ? "border-indigo-600 bg-indigo-600 text-white" : "border-ink-900/20"
          }`}
        >
          All
        </button>
        {categories.map((c) => (
          <button
            key={c._id}
            onClick={() => onCategoryChange(c._id)}
            className={`rounded-sm border px-3 py-1.5 text-sm capitalize ${
              selectedCategory === c._id ? "border-indigo-600 bg-indigo-600 text-white" : "border-ink-900/20"
            }`}
          >
            {c.name}
          </button>
        ))}
      </div>

      <select
        value={sort}
        onChange={(e) => onSortChange(e.target.value)}
        className="rounded-sm border border-ink-900/20 bg-white px-3 py-1.5 text-sm"
      >
        <option value="newest">Newest</option>
        <option value="price_asc">Price: Low to High</option>
        <option value="price_desc">Price: High to Low</option>
        <option value="rating">Top Rated</option>
      </select>
    </div>
  );
}
