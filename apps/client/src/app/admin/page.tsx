"use client";

import { useCallback, useEffect, useState } from "react";
import { Activity, Boxes, ShieldCheck, Users, Warehouse } from "lucide-react";
import { apiFetch } from "@/lib/api";

type Overview = { totalUsers: number; activeUsers: number; inactiveUsers: number; warehouses: number; products: number; inventoryRecords: number };
type User = { id: string; name: string; username: string | null; email: string; role: string; isActive: boolean; createdAt: string };
const roles = ["ADMIN", "MANAGER", "SUPERVISOR", "OPERATOR", "VIEWER"];

export default function AdminPage() {
  const [overview, setOverview] = useState<Overview | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState("");
  const [loading, setLoading] = useState(true);
  const load = useCallback(async () => {
    setLoading(true); setError("");
    try {
      const [overviewResponse, usersResponse] = await Promise.all([apiFetch("/admin/overview"), apiFetch("/admin/users")]);
      if (!overviewResponse.ok || !usersResponse.ok) {
        if (overviewResponse.status === 403 || usersResponse.status === 403) throw new Error("Admin access required. Sign in with an administrator account.");
        throw new Error("Could not load admin information. Please retry.");
      }
      setOverview(await overviewResponse.json()); setUsers(await usersResponse.json());
    } catch (e) { setError(e instanceof Error ? e.message : "Could not load admin information"); }
    finally { setLoading(false); }
  }, []);
  useEffect(() => { const timer = window.setTimeout(() => void load(), 0); return () => window.clearTimeout(timer); }, [load]);

  async function updateUser(user: User, change: { role?: string; isActive?: boolean }) {
    setBusyId(user.id); setError("");
    try {
      const response = await apiFetch(`/admin/users/${user.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(change) });
      const result = await response.json();
      if (!response.ok) throw new Error(typeof result.message === "string" ? result.message : "User update failed");
      setUsers((current) => current.map((item) => item.id === user.id ? result : item));
      await load();
    } catch (e) { setError(e instanceof Error ? e.message : "User update failed"); }
    finally { setBusyId(""); }
  }

  const cards = overview ? [
    { label: "Users", value: overview.totalUsers, icon: Users }, { label: "Active users", value: overview.activeUsers, icon: Activity },
    { label: "Warehouses", value: overview.warehouses, icon: Warehouse }, { label: "Products", value: overview.products, icon: Boxes },
  ] : [];

  return <main className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-8 md:pt-8">
    <div className="mx-auto max-w-7xl space-y-6">
      <header className="flex flex-wrap items-start justify-between gap-4"><div><p className="flex items-center gap-2 text-sm font-semibold text-emerald-800"><ShieldCheck size={17}/> Administration</p><h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">Admin control</h1><p className="mt-2 text-sm text-slate-600">Manage user access and monitor your SmartWMS workspace.</p></div><button onClick={() => void load()} className="min-h-11 rounded-lg border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-700 hover:bg-slate-100">Refresh</button></header>
      {error && <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">{error}</div>}
      <section aria-label="System overview" className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{cards.map(({ label, value, icon: Icon }) => <article key={label} className="rounded-xl border border-slate-200 bg-white p-5"><div className="flex items-center justify-between text-sm font-medium text-slate-500"><span>{label}</span><Icon size={19} className="text-emerald-700"/></div><p className="mt-3 text-3xl font-bold text-slate-900">{loading ? "—" : value.toLocaleString()}</p></article>)}</section>
      <section className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-4 py-4 sm:px-6"><div><h2 className="font-semibold text-slate-900">User access</h2><p className="mt-1 text-sm text-slate-500">Change roles or suspend access. Deactivated users’ sessions are revoked.</p></div><span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">{overview?.inactiveUsers ?? 0} inactive</span></div>
        {loading ? <div className="space-y-3 p-5" aria-label="Loading users">{[0, 1, 2].map((n) => <div key={n} className="h-12 animate-pulse rounded-lg bg-slate-100" />)}</div> : users.length === 0 ? <p className="p-6 text-sm text-slate-500">No users found.</p> : <div className="overflow-x-auto"><table className="w-full min-w-[760px] text-left text-sm"><thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500"><tr><th className="px-5 py-3">User</th><th className="px-5 py-3">Role</th><th className="px-5 py-3">Status</th><th className="px-5 py-3">Joined</th><th className="px-5 py-3">Actions</th></tr></thead><tbody>{users.map((user) => <tr key={user.id} className="border-t border-slate-100"><td className="px-5 py-4"><p className="font-semibold text-slate-800">{user.name}</p><p className="text-xs text-slate-500">{user.email}{user.username ? ` · @${user.username}` : ""}</p></td><td className="px-5 py-4"><label className="sr-only" htmlFor={`role-${user.id}`}>Role for {user.name}</label><select id={`role-${user.id}`} disabled={busyId === user.id} value={user.role} onChange={(event) => void updateUser(user, { role: event.target.value })} className="min-h-10 rounded-lg border border-slate-300 bg-white px-2.5 text-sm">{roles.map((role) => <option key={role} value={role}>{role.replace("_", " ")}</option>)}</select></td><td className="px-5 py-4"><span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${user.isActive ? "bg-emerald-50 text-emerald-800" : "bg-slate-100 text-slate-600"}`}>{user.isActive ? "Active" : "Inactive"}</span></td><td className="px-5 py-4 text-slate-600">{new Date(user.createdAt).toLocaleDateString()}</td><td className="px-5 py-4"><button disabled={busyId === user.id} onClick={() => void updateUser(user, { isActive: !user.isActive })} className="min-h-10 rounded-lg border border-slate-300 px-3 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50">{busyId === user.id ? "Saving…" : user.isActive ? "Deactivate" : "Activate"}</button></td></tr>)}</tbody></table></div>}
      </section>
      <p className="text-xs text-slate-500">Inventory records: {overview?.inventoryRecords ?? "—"}. Only administrator accounts can use these controls.</p>
    </div>
  </main>;
}
