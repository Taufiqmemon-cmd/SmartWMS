"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import { Building2, Bell, Boxes, Save, Settings2, ShieldCheck } from "lucide-react";
import { apiFetch } from "@/lib/api";

type Config = { companyName: string; contactEmail: string; timezone: string; currency: string; lowStockAlerts: boolean; negativeStockPolicy: boolean; valuationMethod: string; purchaseOrderPrefix: string; salesOrderPrefix: string; sessionTimeoutMinutes: number; theme: string };
const defaults: Config = { companyName: "SmartWMS", contactEmail: "", timezone: "Asia/Kolkata", currency: "INR", lowStockAlerts: true, negativeStockPolicy: false, valuationMethod: "FIFO", purchaseOrderPrefix: "PO-", salesOrderPrefix: "SO-", sessionTimeoutMinutes: 480, theme: "system" };
const inputClass = "mt-1.5 min-h-11 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:border-emerald-700 focus:ring-2 focus:ring-emerald-100";

export default function SettingsPage() {
  const [config, setConfig] = useState<Config>(defaults);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const load = useCallback(async () => {
    setLoading(true); setError("");
    try {
      const response = await apiFetch("/admin/settings"); const data = await response.json();
      if (!response.ok) throw new Error(response.status === 403 ? "Admin access required. Sign in with an administrator account." : data.message || "Could not load settings");
      setConfig({ ...defaults, ...data });
    } catch (e) { setError(e instanceof Error ? e.message : "Could not load settings"); }
    finally { setLoading(false); }
  }, []);
  useEffect(() => { const timer = window.setTimeout(() => void load(), 0); return () => window.clearTimeout(timer); }, [load]);
  function change<K extends keyof Config>(key: K, value: Config[K]) { setConfig((current) => ({ ...current, [key]: value })); setMessage(""); }
  async function save(event: FormEvent) {
    event.preventDefault(); setSaving(true); setError(""); setMessage("");
    try {
      const response = await apiFetch("/admin/settings", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(config) }); const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Could not save settings");
      setConfig({ ...defaults, ...result }); setMessage("Settings saved successfully.");
    } catch (e) { setError(e instanceof Error ? e.message : "Could not save settings"); }
    finally { setSaving(false); }
  }
  function reset() { setConfig(defaults); setMessage("Defaults restored. Save changes to apply them."); }

  return <main className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-8 md:pt-8"><div className="mx-auto max-w-5xl space-y-6">
    <header className="flex items-start gap-3"><span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-800"><Settings2/></span><div><p className="text-sm font-semibold text-emerald-800">Administration</p><h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">System settings</h1><p className="mt-2 text-sm text-slate-600">Configuration is saved in the database and shared across administrator sessions.</p></div></header>
    {error && <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">{error}</div>}{message && <div role="status" className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">{message}</div>}
    <form onSubmit={save} className="space-y-5">
      <section className="rounded-xl border border-slate-200 bg-white p-4 sm:p-6"><h2 className="flex items-center gap-2 font-semibold text-slate-900"><Building2 size={18} className="text-emerald-700"/>Company and locale</h2><div className="mt-4 grid gap-4 sm:grid-cols-2"><label className="text-sm font-medium text-slate-700">Company name<input disabled={loading} value={config.companyName} onChange={(e)=>change("companyName",e.target.value)} className={inputClass}/></label><label className="text-sm font-medium text-slate-700">Contact email<input type="email" disabled={loading} value={config.contactEmail} onChange={(e)=>change("contactEmail",e.target.value)} className={inputClass}/></label><label className="text-sm font-medium text-slate-700">Time zone<input disabled={loading} value={config.timezone} onChange={(e)=>change("timezone",e.target.value)} className={inputClass}/></label><label className="text-sm font-medium text-slate-700">Currency<select disabled={loading} value={config.currency} onChange={(e)=>change("currency",e.target.value)} className={inputClass}>{["INR","USD","EUR","GBP","AED"].map((currency)=><option key={currency}>{currency}</option>)}</select></label></div></section>
      <section className="rounded-xl border border-slate-200 bg-white p-4 sm:p-6"><h2 className="flex items-center gap-2 font-semibold text-slate-900"><Boxes size={18} className="text-emerald-700"/>Inventory and orders</h2><div className="mt-4 grid gap-4 sm:grid-cols-2"><label className="text-sm font-medium text-slate-700">Inventory valuation<select disabled={loading} value={config.valuationMethod} onChange={(e)=>change("valuationMethod",e.target.value)} className={inputClass}><option value="FIFO">FIFO</option><option value="LIFO">LIFO</option><option value="WEIGHTED_AVERAGE">Weighted average</option></select></label><label className="text-sm font-medium text-slate-700">Purchase order prefix<input disabled={loading} maxLength={20} value={config.purchaseOrderPrefix} onChange={(e)=>change("purchaseOrderPrefix",e.target.value)} className={inputClass}/></label><label className="text-sm font-medium text-slate-700">Sales order prefix<input disabled={loading} maxLength={20} value={config.salesOrderPrefix} onChange={(e)=>change("salesOrderPrefix",e.target.value)} className={inputClass}/></label><label className="flex min-h-11 items-center gap-3 rounded-lg border border-slate-200 px-3 text-sm text-slate-700"><input type="checkbox" checked={config.negativeStockPolicy} onChange={(e)=>change("negativeStockPolicy",e.target.checked)} className="h-4 w-4 accent-emerald-700"/>Allow negative stock</label></div></section>
      <section className="rounded-xl border border-slate-200 bg-white p-4 sm:p-6"><h2 className="flex items-center gap-2 font-semibold text-slate-900"><Bell size={18} className="text-emerald-700"/>Alerts and security</h2><div className="mt-4 grid gap-4 sm:grid-cols-2"><label className="flex min-h-11 items-center gap-3 rounded-lg border border-slate-200 px-3 text-sm text-slate-700"><input type="checkbox" checked={config.lowStockAlerts} onChange={(e)=>change("lowStockAlerts",e.target.checked)} className="h-4 w-4 accent-emerald-700"/>Enable low-stock alerts</label><label className="text-sm font-medium text-slate-700">Session timeout (minutes)<input type="number" min={15} max={1440} step={15} disabled={loading} value={config.sessionTimeoutMinutes} onChange={(e)=>change("sessionTimeoutMinutes",Number(e.target.value))} className={inputClass}/></label><label className="text-sm font-medium text-slate-700 sm:col-span-2">Appearance<select disabled={loading} value={config.theme} onChange={(e)=>change("theme",e.target.value)} className={inputClass}><option value="system">Use device preference</option><option value="light">Light</option><option value="dark">Dark</option></select></label></div><p className="mt-3 flex items-center gap-1.5 text-xs text-slate-500"><ShieldCheck size={14}/>Changes here require administrator access. Passwords and tokens are never shown.</p></section>
      <div className="sticky bottom-0 flex flex-wrap justify-end gap-3 border-t border-slate-200 bg-slate-50/95 py-4 backdrop-blur"><button type="button" disabled={loading||saving} onClick={reset} className="min-h-11 rounded-lg border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-700 hover:bg-slate-100">Restore defaults</button><button type="submit" disabled={loading||saving} className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-emerald-800 px-5 text-sm font-semibold text-white hover:bg-emerald-900 disabled:opacity-60"><Save size={16}/>{saving?"Saving…":"Save settings"}</button></div>
    </form>
  </div></main>;
}
