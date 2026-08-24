"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth.context";
import { Role } from "@/types";

/**
 * Wraps a page component so it only renders for a logged-in user
 * (optionally restricted to specific roles). Used to protect the
 * checkout, account, and every /admin/* page.
 *
 * Usage: export default withAuth(AdminProductsPage, ["admin"]);
 */
const withAuth = (Component: React.ComponentType, roles?: Role[]) => {
  return function ProtectedRoute(props: any) {
    const { user, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (isLoading) return;
      if (!user) {
        router.replace("/login");
        return;
      }
      if (roles && !roles.includes(user.role)) {
        router.replace("/");
      }
    }, [isLoading, user, router]);

    if (isLoading || !user || (roles && !roles.includes(user.role))) {
      return (
        <div className="flex min-h-[50vh] items-center justify-center text-ink-700">
          Loading...
        </div>
      );
    }

    return <Component {...props} />;
  };
};

export default withAuth;
