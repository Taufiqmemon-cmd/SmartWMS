"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AlertTriangle, Boxes, ClipboardList, Package, RefreshCw, Warehouse } from "lucide-react";
import { apiFetch } from "@/lib/api";

type DashboardData = {
  generatedAt: string; totalProducts: number; warehouses: number; totalUnits: number; availableUnits: number; reservedUnits: number; pendingOrders: number;
  inventoryHealth: { healthy: number; lowStock: number; outOfStock: number; total: number };
  lowStockProducts: Array<{ id: string; name: string; sku: string; unit: string; available: number; minimum: number }>;
  movementTrend: Array<{ date: string; label: string; inbound: number; outbound: number }>;
  recentMovements: Array<{ id: string; type: string; quantity: string | number; reference?: string | null; createdAt: string; product: { name: string; sku: string; unit: string }; warehouse: { name: string; code: string } }>;
};

const numberFormat = new Intl.NumberFormat(undefined, { maximumFractionDigits: 2 });
const movementTitle: Record<string, string> = { INBOUND: "Stock received", OUTBOUND: "Stock dispatched", TRANSFER: "Stock transferred", ADJUSTMENT: "Stock adjusted", RETURN: "Stock returned" };

export default function Home() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [userName, setUserName] = useState("");
  const load = useCallback(async () => {
    setLoading(true); setError("");
    try {
      const response = await apiFetch("/reports/dashboard", { cache: "no-store" });
      const result = await response.json();
      if (!response.ok) throw new Error(typeof result.message === "string" ? result.message : "Could not load live dashboard data.");
      setData(result);
    } catch (e) { setError(e instanceof Error ? e.message : "Could not load live dashboard data."); }
    finally { setLoading(false); }
  }, []);
  useEffect(() => { const timer = window.setTimeout(() => void load(), 0); return () => window.clearTimeout(timer); }, [load]);
  useEffect(() => {
    let active = true;
    apiFetch("/auth/me", { cache: "no-store" }).then(async (response) => {
      if (!response.ok) return;
      const user = await response.json();
      if (active && typeof user.name === "string") setUserName(user.name);
    }).catch(() => undefined);
    return () => { active = false; };
  }, []);
  const health = data?.inventoryHealth ?? { healthy: 0, lowStock: 0, outOfStock: 0, total: 0 };
  const healthyPercent = health.total ? Math.round(health.healthy / health.total * 100) : 0;
  const lowPercent = health.total ? Math.round(health.lowStock / health.total * 100) : 0;
  const outPercent = health.total ? Math.max(0, 100 - healthyPercent - lowPercent) : 0;
  const chartMaximum = Math.max(1, ...(data?.movementTrend.map((item) => Math.max(item.inbound, item.outbound)) ?? []));
  const chartBackground = health.total
    ? `conic-gradient(#047857 0% ${healthyPercent}%, #f59e0b ${healthyPercent}% ${healthyPercent + lowPercent}%, #ef4444 ${healthyPercent + lowPercent}% 100%)`
    : "#e2e8f0";

  return (
    <div className="min-h-screen bg-[#f5f7fb] text-slate-800">
      <main className="min-w-0">
        <header className="sticky top-0 z-10 flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 bg-white/90 px-5 py-4 backdrop-blur md:px-8">
          <div>
            <p className="text-xs text-slate-400">SmartWMS / Dashboard</p>
            <h2 className="mt-1 text-xl font-bold text-slate-900">Dashboard Overview</h2>
          </div>
          <div className="flex items-center gap-3">
            <span className={`hidden rounded-lg px-3 py-2 text-xs font-medium sm:block ${error ? "bg-amber-50 text-amber-800" : "bg-green-50 text-green-700"}`}>{error ? "Data unavailable" : loading ? "Updating…" : "Live data"}</span>
            <button onClick={() => void load()} disabled={loading} aria-label="Refresh dashboard" title="Refresh dashboard" className="rounded-xl border border-slate-200 p-2.5 text-slate-600 hover:bg-slate-50 disabled:opacity-50"><RefreshCw size={17} className={loading ? "animate-spin" : ""}/></button>
            <div aria-label={userName || "Signed-in user"} className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-100 text-sm font-bold text-emerald-800">{userName ? userName[0].toUpperCase() : "·"}</div>
          </div>
        </header>

        <div className="space-y-6 p-5 md:p-8">
          {error && <div role="alert" className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900"><span>{error}</span><button onClick={() => void load()} className="min-h-10 rounded-lg border border-amber-300 bg-white px-3 font-semibold hover:bg-amber-100">Retry</button></div>}
          <section className="flex flex-wrap items-end justify-between gap-3">
            <div><p className="text-sm text-slate-500">{new Intl.DateTimeFormat(undefined, { weekday: "long", month: "long", day: "numeric", year: "numeric" }).format(new Date())}</p><h3 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">Welcome back{userName ? `, ${userName}` : ""}</h3><p className="mt-1 text-sm text-slate-500">Live overview of your warehouse operations.</p></div>
            <Link href="/reports" className="rounded-lg bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-800">View Reports</Link>
          </section>

          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {[
              { label: "Active Products", value: data?.totalProducts, icon: Package, tone: "bg-emerald-50 text-emerald-700", note: "in product catalog" },
              { label: "Inventory Units", value: data?.totalUnits, icon: Boxes, tone: "bg-violet-50 text-violet-700", note: `${numberFormat.format(data?.availableUnits ?? 0)} available · ${numberFormat.format(data?.reservedUnits ?? 0)} reserved` },
              { label: "Pending Orders", value: data?.pendingOrders, icon: ClipboardList, tone: "bg-amber-50 text-amber-700", note: "purchase and sales orders" },
              { label: "Warehouses", value: data?.warehouses, icon: Warehouse, tone: "bg-green-50 text-green-700", note: "in the system" },
            ].map((stat) => (
              <div key={stat.label} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between"><span className="text-sm font-medium text-slate-500">{stat.label}</span><span className={`flex h-10 w-10 items-center justify-center rounded-xl ${stat.tone}`}><stat.icon size={19}/></span></div>
                <p className="mt-4 text-3xl font-bold tracking-tight text-slate-900">{loading || !data ? "—" : numberFormat.format(stat.value ?? 0)}</p>
                <p className="mt-2 text-xs text-slate-400">{stat.note}</p>
              </div>
            ))}
          </section>

          <section className="grid gap-6 xl:grid-cols-3">
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm xl:col-span-2">
              <div className="flex flex-wrap items-center justify-between gap-3"><div><h3 className="font-bold text-slate-900">Stock Movement</h3><p className="mt-1 text-xs text-slate-400">Recorded inbound and outbound units</p></div><span className="rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-500">Last 7 days</span></div>
              <div className="mt-8 flex h-52 items-end justify-between gap-3 border-b border-slate-100 px-2">
                {(data?.movementTrend ?? []).map((day) => (
                  <div key={day.date} className="flex h-full flex-1 flex-col items-center justify-end gap-2"><div className="flex w-full items-end justify-center gap-1" style={{ height: "85%" }}><div title={`Inbound ${numberFormat.format(day.inbound)}`} className="w-1/3 rounded-t bg-emerald-200 transition-[height] duration-500" style={{ height: day.inbound ? `${Math.max(4, day.inbound / chartMaximum * 100)}%` : "0%" }}></div><div title={`Outbound ${numberFormat.format(day.outbound)}`} className="w-1/3 rounded-t bg-emerald-700 transition-[height] duration-500" style={{ height: day.outbound ? `${Math.max(4, day.outbound / chartMaximum * 100)}%` : "0%" }}></div></div><span className="text-xs text-slate-400">{day.label}</span></div>
                ))}
                {!loading && !data?.movementTrend.length && <p className="m-auto text-sm text-slate-400">No stock movements in this period.</p>}
              </div>
              <div className="mt-4 flex flex-wrap gap-5 text-xs text-slate-500"><span><span className="mr-2 inline-block h-2 w-2 rounded-sm bg-emerald-200"></span>Stock In</span><span><span className="mr-2 inline-block h-2 w-2 rounded-sm bg-emerald-700"></span>Stock Out</span></div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="font-bold text-slate-900">Inventory Health</h3><p className="mt-1 text-xs text-slate-400">Active product availability vs minimum stock</p>
              <div className="mx-auto my-7 flex h-40 w-40 items-center justify-center rounded-full" style={{ background: chartBackground }}><div className="flex h-28 w-28 flex-col items-center justify-center rounded-full bg-white"><span className="text-3xl font-bold">{loading ? "—" : `${healthyPercent}%`}</span><span className="text-xs text-slate-400">Healthy products</span></div></div>
              <div className="space-y-3 text-sm">{[{name:"Healthy",value:healthyPercent,count:health.healthy,color:"bg-emerald-700"},{name:"Low stock",value:lowPercent,count:health.lowStock,color:"bg-amber-500"},{name:"Out of stock",value:outPercent,count:health.outOfStock,color:"bg-red-500"}].map(x=><div key={x.name} className="flex items-center justify-between"><span className="flex items-center gap-2 text-slate-500"><span className={`h-2.5 w-2.5 rounded-full ${x.color}`}></span>{x.name}</span><span className="font-semibold">{loading?"—":`${x.count} · ${x.value}%`}</span></div>)}</div>
            </div>
          </section>

          <section className="grid gap-6 xl:grid-cols-3">
            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm xl:col-span-2">
              <div className="flex items-center justify-between border-b border-slate-100 p-5"><div><h3 className="font-bold text-slate-900">Recent Stock Movements</h3><p className="mt-1 text-xs text-slate-400">Latest recorded inventory transactions</p></div><Link href="/reports" className="text-xs font-semibold text-emerald-700">View reports →</Link></div>
              <div className="overflow-x-auto"><table className="w-full min-w-[540px] text-left text-sm"><thead className="bg-slate-50 text-xs uppercase text-slate-400"><tr><th className="px-5 py-3 font-medium">Movement</th><th className="px-5 py-3 font-medium">Reference</th><th className="px-5 py-3 font-medium">Date</th><th className="px-5 py-3 font-medium">Quantity</th></tr></thead><tbody>{(data?.recentMovements ?? []).map((movement)=><tr key={movement.id} className="border-t border-slate-100"><td className="px-5 py-4"><p className="font-semibold text-slate-700">{movementTitle[movement.type] ?? movement.type}</p><p className="mt-1 text-xs text-slate-400">{movement.product.name} · {movement.product.sku}</p></td><td className="px-5 py-4 text-xs text-slate-500">{movement.reference || movement.warehouse.code}<p className="mt-1">{movement.warehouse.name}</p></td><td className="px-5 py-4 text-xs text-slate-500">{new Intl.DateTimeFormat(undefined,{month:"short",day:"numeric",hour:"numeric",minute:"2-digit"}).format(new Date(movement.createdAt))}</td><td className="px-5 py-4 font-semibold text-slate-700">{numberFormat.format(Number(movement.quantity))} {movement.product.unit}</td></tr>)}{!loading&&!data?.recentMovements.length&&<tr><td colSpan={4} className="p-10 text-center text-sm text-slate-500">No stock movements have been recorded yet.</td></tr>}{loading&&<tr><td colSpan={4} className="p-10 text-center text-sm text-slate-400">Loading current movements…</td></tr>}</tbody></table></div>
            </div>

            <div className="rounded-xl border border-amber-100 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-2"><AlertTriangle size={18} className="text-amber-600"/><h3 className="font-bold text-slate-900">Replenishment needed</h3></div>
              <p className="mt-2 text-xs text-slate-500">Products below their configured minimum stock.</p>
              <div className="mt-4 space-y-3">{(data?.lowStockProducts ?? []).map((product)=><div key={product.id} className="flex items-start justify-between gap-3 border-b border-slate-100 pb-3"><div className="min-w-0"><p className="truncate text-sm font-semibold text-slate-700">{product.name}</p><p className="mt-1 font-mono text-xs text-slate-400">{product.sku}</p></div><span className="shrink-0 text-right text-xs font-semibold text-amber-700">{numberFormat.format(product.available)} / {numberFormat.format(product.minimum)} {product.unit}</span></div>)}{!loading&&!data?.lowStockProducts.length&&<p className="rounded-lg bg-emerald-50 p-3 text-sm text-emerald-800">No active products are below minimum stock.</p>}{loading&&<p className="py-6 text-sm text-slate-400">Loading stock status…</p>}</div>
              <Link href="/replenishment" className="mt-4 inline-flex min-h-10 w-full items-center justify-center rounded-lg bg-emerald-700 px-3 text-sm font-semibold text-white hover:bg-emerald-800">Open replenishment</Link>
            </div>
          </section>

          <footer className="flex flex-wrap justify-between gap-2 border-t border-slate-200 pt-5 text-xs text-slate-400"><span>SmartWMS · Warehouse Management System</span><span>{data ? `Data refreshed ${new Intl.DateTimeFormat(undefined,{hour:"numeric",minute:"2-digit"}).format(new Date(data.generatedAt))}` : "Waiting for dashboard data"}</span></footer>
        </div>
      </main>
    </div>
  );
}








