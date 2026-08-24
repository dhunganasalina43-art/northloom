"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import withAuth from "@/hoc/withAuth";
import { getOrders, updateOrderStatus } from "@/services/order.service";
import { IOrder, OrderStatus } from "@/types";

const statuses: OrderStatus[] = ["pending", "processing", "shipped", "delivered", "cancelled"];

function AdminOrdersPage() {
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const load = () => {
    setIsLoading(true);
    getOrders({ page: 1 }).then((res) => setOrders(res.data)).finally(() => setIsLoading(false));
  };

  useEffect(load, []);

  const onStatusChange = async (id: string, status: string) => {
    try {
      await updateOrderStatus(id, status);
      toast.success("Order status updated");
      load();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Could not update status");
    }
  };

  return (
    <div>
      <h1 className="font-serif text-2xl text-ink-900">Orders</h1>
      <div className="thread-rule my-4 w-16" />

      {isLoading ? (
        <p className="text-ink-900/60">Loading orders...</p>
      ) : (
        <div className="overflow-x-auto rounded-sm border border-ink-900/10">
          <table className="w-full text-sm">
            <thead className="bg-linen-100 text-left text-ink-900/60">
              <tr>
                <th className="px-4 py-3">Order</th>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Total</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-900/10">
              {orders.map((order) => (
                <tr key={order._id}>
                  <td className="px-4 py-3 text-ink-900">#{order._id.slice(-8).toUpperCase()}</td>
                  <td className="px-4 py-3">{typeof order.user === "object" ? order.user.full_name : ""}</td>
                  <td className="px-4 py-3">${order.total.toFixed(2)}</td>
                  <td className="px-4 py-3">
                    <select
                      value={order.status}
                      onChange={(e) => onStatusChange(order._id, e.target.value)}
                      className="rounded-sm border border-ink-900/20 px-2 py-1 text-sm capitalize"
                    >
                      {statuses.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
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

export default withAuth(AdminOrdersPage, ["admin"]);
