"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { getOrderById } from "@/services/order.service";
import { IOrder } from "@/types";
import withAuth from "@/hoc/withAuth";

function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const confirmed = searchParams.get("confirmed") === "1";

  const [order, setOrder] = useState<IOrder | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getOrderById(id).then((res) => setOrder(res.data)).finally(() => setIsLoading(false));
  }, [id]);

  if (isLoading) return <p className="text-ink-900/60">Loading order...</p>;
  if (!order) return <p className="text-ink-900/60">Order not found.</p>;

  return (
    <div>
      {confirmed && (
        <div className="mb-6 rounded-sm border border-green-200 bg-green-50 px-5 py-4 text-green-800">
          Thank you — your order has been placed successfully.
        </div>
      )}

      <h1 className="font-serif text-3xl text-ink-900">
        Order #{order._id.slice(-8).toUpperCase()}
      </h1>
      <p className="mt-1 text-sm text-ink-900/60 capitalize">Status: {order.status}</p>
      <div className="thread-rule my-4 w-16" />

      <div className="grid gap-10 md:grid-cols-3">
        <div className="md:col-span-2">
          <h2 className="mb-3 font-serif text-lg text-ink-900">Items</h2>
          <div className="divide-y divide-ink-900/10 rounded-sm border border-ink-900/10">
            {order.items.map((item, i) => (
              <div key={i} className="flex justify-between px-5 py-3 text-sm">
                <span>{item.name} × {item.quantity}</span>
                <span>${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="h-fit space-y-6 rounded-sm border border-ink-900/10 bg-linen-100 p-6">
          <div>
            <h2 className="font-serif text-lg text-ink-900">Shipping to</h2>
            <p className="mt-2 text-sm text-ink-900/70">
              {order.shipping_address.full_name}<br />
              {order.shipping_address.line1}<br />
              {order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.postal_code}<br />
              {order.shipping_address.country}<br />
              {order.shipping_address.phone}
            </p>
          </div>

          <div className="space-y-1 border-t border-ink-900/10 pt-4 text-sm">
            <div className="flex justify-between text-ink-900/70">
              <span>Subtotal</span>
              <span>${order.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-ink-900/70">
              <span>Shipping</span>
              <span>${order.shipping_fee.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-semibold text-ink-900">
              <span>Total</span>
              <span>${order.total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default withAuth(OrderDetailPage);
