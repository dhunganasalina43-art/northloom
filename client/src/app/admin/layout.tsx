"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/categories", label: "Categories" },
  { href: "/admin/orders", label: "Orders" },
  { href: "/admin/users", label: "Customers" },
];

/** Shared sidebar shell for every /admin/* page. Auth/role protection is applied per-page via withAuth. */
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="grid gap-8 md:grid-cols-[200px_1fr]">
      <aside className="space-y-1">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`block rounded-sm px-3 py-2 text-sm ${
              pathname === link.href ? "bg-indigo-600 text-white" : "text-ink-900/80 hover:bg-linen-100"
            }`}
          >
            {link.label}
          </Link>
        ))}
      </aside>
      <div>{children}</div>
    </div>
  );
}
