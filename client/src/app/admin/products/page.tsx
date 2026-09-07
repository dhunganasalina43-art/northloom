"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import withAuth from "@/hoc/withAuth";
import { getProducts, deleteProduct } from "@/services/product.service";
import { IProduct } from "@/types";
import Button from "@/components/ui/Button";
import { formatPrice } from "@/lib/currency";

function AdminProductsPage() {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const load = () => {
    setIsLoading(true);
    getProducts({ limit: 50, sort: "newest" }).then((res) => setProducts(res.data)).finally(() => setIsLoading(false));
  };

  useEffect(load, []);

  const onDelete = async (id: string) => {
    if (!confirm("Delete this product? This cannot be undone.")) return;
    try {
      await deleteProduct(id);
      toast.success("Product deleted");
      load();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Could not delete product");
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-2xl text-ink-900">Products</h1>
        <Link href="/admin/products/new">
          <Button>Add product</Button>
        </Link>
      </div>
      <div className="thread-rule my-4 w-16" />

      {isLoading ? (
        <p className="text-ink-900/60">Loading products...</p>
      ) : (
        <div className="overflow-x-auto rounded-sm border border-ink-900/10">
          <table className="w-full text-sm">
            <thead className="bg-linen-100 text-left text-ink-900/60">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Stock</th>
                <th className="px-4 py-3">Featured</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-900/10">
              {products.map((p) => (
                <tr key={p._id}>
                  <td className="px-4 py-3 text-ink-900">{p.name}</td>
                  <td className="px-4 py-3">{formatPrice(p.price)}</td>
                  <td className="px-4 py-3">{p.stock}</td>
                  <td className="px-4 py-3">{p.is_featured ? "Yes" : "No"}</td>
                  <td className="space-x-3 px-4 py-3 text-right">
                    <Link href={`/admin/products/${p._id}/edit`} className="text-indigo-600 hover:text-indigo-700">
                      Edit
                    </Link>
                    <button onClick={() => onDelete(p._id)} className="text-weft-600 hover:text-weft-600/80">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default withAuth(AdminProductsPage, ["admin"]);
