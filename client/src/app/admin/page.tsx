"use client";

import { useEffect, useState } from "react";
import withAuth from "@/hoc/withAuth";
import api from "@/lib/api";

type TSummary = {
  productCount: number;
  orderCount: number;
  userCount: number;
  revenue: number;
};

/**
 * Admin dashboard landing page. Pulls lightweight counts from the existing
 * list endpoints (page=1&limit=1, reading the `meta.total_count`) rather
 * than needing a dedicated analytics endpoint.
 */
function AdminDashboardPage() {
  const [summary, setSummary] = useState<TSummary | null>(null);

  useEffect(() => {
    const load = async () => {
      const [productsRes, ordersRes, usersRes] = await Promise.all([
        api.get("/products", { params: { limit: 1 } }),
        api.get("/orders", { params: { limit: 1 } }),
        api.get("/users", { params: { limit: 1 } }),
      ]);
      const revenue = 0; // computed on the orders page from the full order list
      setSummary({
        productCount: productsRes.data.meta?.total_count || 0,
        orderCount: ordersRes.data.meta?.total_count || 0,
        userCount: usersRes.data.meta?.total_count || 0,
        revenue,
      });
    };
    load();
  }, []);

  const cards = [
    { label: "Products", value: summary?.productCount },
    { label: "Orders", value: summary?.orderCount },
    { label: "Customers", value: summary?.userCount },
  ];

  return (
    <div>
      <h1 className="font-serif text-2xl text-ink-900">Dashboard</h1>
      <div className="thread-rule my-4 w-16" />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {cards.map((card) => (
          <div key={card.label} className="rounded-sm border border-ink-900/10 bg-linen-100 p-6">
            <p className="text-sm text-ink-900/60">{card.label}</p>
            <p className="mt-2 font-serif text-3xl text-ink-900">{card.value ?? "—"}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default withAuth(AdminDashboardPage, ["admin"]);
