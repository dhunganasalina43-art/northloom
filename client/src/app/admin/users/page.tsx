"use client";

import { useEffect, useState } from "react";
import withAuth from "@/hoc/withAuth";
import api from "@/lib/api";
import { IUser } from "@/types";

function AdminUsersPage() {
  const [users, setUsers] = useState<IUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    api.get("/users", { params: { limit: 50 } })
      .then((res) => setUsers(res.data.data))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div>
      <h1 className="font-serif text-2xl text-ink-900">Customers</h1>
      <div className="thread-rule my-4 w-16" />

      {isLoading ? (
        <p className="text-ink-900/60">Loading customers...</p>
      ) : (
        <div className="overflow-x-auto rounded-sm border border-ink-900/10">
          <table className="w-full text-sm">
            <thead className="bg-linen-100 text-left text-ink-900/60">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-900/10">
              {users.map((u) => (
                <tr key={u._id}>
                  <td className="px-4 py-3 text-ink-900">{u.full_name}</td>
                  <td className="px-4 py-3">{u.email}</td>
                  <td className="px-4 py-3 capitalize">{u.role}</td>
                  <td className="px-4 py-3">{new Date(u.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default withAuth(AdminUsersPage, ["admin"]);
