"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getOrders } from "@/services/order.service";
import { IOrder } from "@/types";
import withAuth from "@/hoc/withAuth";

const statusColor: Record<string, string> = {
  pending: "bg-linen-200 text-ink-900",
  processing: "bg-indigo-100 text-indigo-700",
  shipped: "bg-indigo-100 text-indigo-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-weft-500/10 text-weft-600",
};

function OrdersPage() {
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getOrders().then((res) => setOrders(res.data)).finally(() => setIsLoading(false));
  }, []);

  return (
    <div>
      <h1 className="font-serif text-3xl text-ink-900">Order history</h1>
      <div className="thread-rule my-4 w-16" />

      {isLoading ? (
        <p className="text-ink-900/60">Loading your orders...</p>
      ) : orders.length === 0 ? (
        <p className="text-ink-900/60">You haven't placed any orders yet.</p>
      ) : (
        <div className="divide-y divide-ink-900/10 rounded-sm border border-ink-900/10">
          {orders.map((order) => (
            <Link
              key={order._id}
              href={`/orders/${order._id}`}
              className="flex items-center justify-between px-5 py-4 hover:bg-linen-100"
            >
              <div>
                <p className="text-sm font-medium text-ink-900">Order #{order._id.slice(-8).toUpperCase()}</p>
                <p className="text-xs text-ink-900/50">{new Date(order.createdAt).toLocaleDateString()}</p>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-ink-900">${order.total.toFixed(2)}</span>
                <span className={`rounded-full px-2.5 py-1 text-xs font-medium capitalize ${statusColor[order.status]}`}>
                  {order.status}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default withAuth(OrdersPage);
