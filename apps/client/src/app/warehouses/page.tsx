"use client";
import { apiFetch } from "@/lib/api";
import { useCallback, useEffect, useMemo, useState, type FormEvent } from "react";
import styles from "./warehouses.module.css";
import {
  AlertCircle, ArrowLeftRight, Building2, CheckCircle2, Database,
  Loader2, MapPin, Package, Pencil, Plus, RefreshCw, Search,
  Trash2, Warehouse as WarehouseIcon, X, Boxes
} from "lucide-react";

type Warehouse = {
  id: string;
  code: string;
  name: string;
  address?: string | null;
  _count?: {
    locations: number;
    movements: number;
  };
};

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4001";

export default function WarehousesPage() {
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");

  const loadWarehouses = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await apiFetch(`${API}/warehouses`, { cache: "no-store" });
      if (!response.ok) throw new Error(`Unable to load warehouses (${response.status})`);
      const payload = await response.json();
      const records = Array.isArray(payload)
        ? payload
        : Array.isArray(payload?.value)
          ? payload.value
          : Array.isArray(payload?.data)
            ? payload.data
            : [];
      setWarehouses(records);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load warehouses.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadWarehouses();
  }, [loadWarehouses]);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return warehouses;
    return warehouses.filter((w) =>
      `${w.code} ${w.name} ${w.address || ""}`.toLowerCase().includes(term)
    );
  }, [warehouses, search]);

  const totalLocations = warehouses.reduce((sum, w) => sum + (w._count?.locations || 0), 0);
  const totalMovements = warehouses.reduce((sum, w) => sum + (w._count?.movements || 0), 0);

  function resetForm() {
    setCode("");
    setName("");
    setAddress("");
    setEditing(null);
    setShowForm(false);
  }

  function startEdit(w: Warehouse) {
    setEditing(w.id);
    setCode(w.code);
    setName(w.name);
    setAddress(w.address || "");
    setError("");
    setSuccess("");
    setShowForm(true);
  }

  async function saveWarehouse(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!code.trim() || !name.trim()) return;

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const response = await apiFetch(
        editing ? `${API}/warehouses/${editing}` : `${API}/warehouses`,
        {
          method: editing ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            code: code.trim(),
            name: name.trim(),
            address: address.trim() || null,
          }),
        }
      );

      if (!response.ok) {
        let message = `Save failed (${response.status})`;
        try {
          const result = await response.json();
          message = Array.isArray(result.message)
            ? result.message.join(", ")
            : result.message || message;
        } catch {}
        throw new Error(message);
      }

      resetForm();
      setSuccess(editing ? "Warehouse updated successfully." : "Warehouse created successfully.");
      await loadWarehouses();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to save warehouse.");
    } finally {
      setSaving(false);
    }
  }

  async function deleteWarehouse(w: Warehouse) {
    if (!window.confirm(`Are you sure you want to delete "${w.name}" (${w.code})?`)) return;

    setDeleting(w.id);
    setError("");
    setSuccess("");

    try {
      const response = await apiFetch(`${API}/warehouses/${w.id}`, { method: "DELETE" });
      if (!response.ok) {
        let message = `Delete failed (${response.status})`;
        try {
          const result = await response.json();
          message = result.message || message;
        } catch {}
        throw new Error(message);
      }
      setSuccess("Warehouse deleted successfully.");
      await loadWarehouses();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to delete warehouse.");
    } finally {
      setDeleting(null);
    }
  }

  const stats = [
    { label: "Total Warehouses", value: warehouses.length, icon: Building2, tone: "blue" },
    { label: "Total Locations", value: totalLocations, icon: MapPin, tone: "violet" },
    { label: "Stock Movements", value: totalMovements, icon: ArrowLeftRight, tone: "amber" },
    { label: "Database Status", value: loading ? "Loading" : error ? "Check API" : "Connected", icon: Database, tone: "green" },
  ];

  return (
    <main className={`${styles.page} min-h-screen p-4 sm:p-6 lg:p-8`}>
      <div className={`${styles.content} mx-auto space-y-7`}>

        <section className={`${styles.pageHeader} flex flex-col justify-between gap-5 rounded-2xl border p-5 shadow-sm sm:flex-row sm:items-center sm:p-6`}>
          <div>
            <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
              <span>SmartWMS</span><span>/</span><span>Warehouse Management</span>
            </div>
            <div className="flex items-center gap-3">
              <div className={`${styles.headerIcon} rounded-xl p-3`}>
                <WarehouseIcon size={27} />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">Warehouse Management</h1>
                <p className="mt-1 text-sm text-slate-500">Manage your storage facilities and warehouse operations.</p>
              </div>
            </div>
          </div>
          <button
            onClick={() => { resetForm(); setError(""); setSuccess(""); setShowForm(true); }}
            className={`${styles.primaryAction} inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold text-white transition`}
          >
            <Plus size={18} /> Add Warehouse
          </button>
        </section>

        {error && (
          <div role="alert" className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            <AlertCircle size={19} className="mt-0.5 shrink-0" />
            <div className="flex-1">{error}</div>
            <button onClick={() => void loadWarehouses()} className="font-semibold underline">Retry</button>
          </div>
        )}

        {success && (
          <div role="status" className="flex items-center gap-3 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-800">
            <CheckCircle2 size={19} /> {success}
            <button onClick={() => setSuccess("")} className="ml-auto"><X size={17} /></button>
          </div>
        )}

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.label} className={`${styles.statCard} rounded-2xl border bg-white p-5`}>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-500">{item.label}</span>
                  <span className={`${styles.statIcon} rounded-xl p-3 ${item.tone === "amber" ? "bg-amber-50 text-amber-700" : ""}`}><Icon size={21} /></span>
                </div>
                <p className="mt-4 text-3xl font-bold tracking-tight text-slate-900">{item.value}</p>
                {item.label === "Database Status" && (
                  <p className="mt-1 text-xs text-slate-400">Warehouse API connection</p>
                )}
              </div>
            );
          })}
        </section>

        <section className={`${styles.directory} overflow-hidden rounded-2xl border bg-white`}>
          <div className={`${styles.toolbar} flex flex-col justify-between gap-4 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:p-6`}>
            <div>
              <h2 className="text-lg font-bold text-slate-900">All Warehouses</h2>
              <p className="mt-1 text-sm text-slate-500">Live warehouse directory and operational overview</p>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <div className={`${styles.searchBox} relative`}>
                <Search size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search warehouses..."
                  aria-label="Search warehouses"
                  className="w-full rounded-xl border py-2.5 pl-10 pr-4 text-sm outline-none"
                />
              </div>
              <button
                onClick={() => void loadWarehouses()}
                disabled={loading}
                className={`${styles.actionButton} inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-50`}
              >
                <RefreshCw size={16} className={loading ? "animate-spin" : ""} /> Refresh
              </button>
            </div>
          </div>

          <div className={`${styles.tableViewport} overflow-x-auto`}>
            <table className={`${styles.table} w-full text-left text-sm`}>
              <thead className="text-xs font-semibold uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4">Warehouse</th>
                  <th className="px-6 py-4">Code</th>
                  <th className="px-6 py-4">Address</th>
                  <th className="px-6 py-4">Locations</th>
                  <th className="px-6 py-4">Movements</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((w) => (
                  <tr key={w.id}>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`${styles.rowIcon} rounded-lg p-2`}><WarehouseIcon size={19} /></div>
                        <span className="font-semibold text-slate-800">{w.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4"><span className={`${styles.codeBadge} rounded-md px-2.5 py-1 font-mono text-xs font-semibold`}>{w.code}</span></td>
                    <td className="px-6 py-4 text-slate-500">{w.address || "—"}</td>
                    <td className="px-6 py-4"><span className="inline-flex items-center gap-2 text-slate-600"><Boxes size={16} className="text-slate-400" />{w._count?.locations ?? 0}</span></td>
                    <td className="px-6 py-4"><span className="inline-flex items-center gap-2 text-slate-600"><Package size={16} className="text-slate-400" />{w._count?.movements ?? 0}</span></td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => startEdit(w)} aria-label={`Edit ${w.name}`} className={`${styles.actionButton} inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-800`}>
                          <Pencil size={14} /> Edit
                        </button>
                        <button onClick={() => void deleteWarehouse(w)} disabled={deleting === w.id} aria-label={`Delete ${w.name}`} className={`${styles.actionButton} inline-flex items-center gap-1.5 rounded-lg border border-red-100 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 disabled:opacity-50`}>
                          {deleting === w.id ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />} Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {!loading && filtered.length === 0 && (
                  <tr className={styles.emptyState}>
                    <td colSpan={6} className="px-6 py-16 text-center">
                      <div className={`${styles.emptyIcon} mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl`}><WarehouseIcon size={27} /></div>
                      <p className="font-semibold text-slate-700">{search ? "No matching warehouses found" : "No warehouses yet"}</p>
                      <p className="mt-1 text-sm text-slate-400">{search ? "Try another search term." : "Add your first warehouse to get started."}</p>
                    </td>
                  </tr>
                )}

                {loading && (
                  <tr><td colSpan={6} className="px-6 py-14 text-center text-sm text-slate-400">
                    <Loader2 size={22} className="mx-auto mb-2 animate-spin" /> Loading warehouses...
                  </td></tr>
                )}
              </tbody>
            </table>
          </div>
          <div className={`${styles.directoryFooter} flex flex-col justify-between gap-2 border-t border-slate-100 px-6 py-4 text-xs text-slate-500 sm:flex-row`}>
            <span>Showing {filtered.length} of {warehouses.length} warehouses</span>
            <span>Connected to SmartWMS database</span>
          </div>
        </section>
      </div>

      {showForm && (
        <div className={`${styles.modalOverlay} fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/55 p-4 backdrop-blur-sm`} onMouseDown={(e) => { if (e.target === e.currentTarget && !saving) resetForm(); }}>
          <form onSubmit={saveWarehouse} className={`${styles.modalForm} my-auto w-full max-w-2xl rounded-2xl border bg-white`}>
            <div className={`${styles.formHeader} flex items-center justify-between border-b border-slate-100 px-5 py-4 sm:px-6 sm:py-5`}>
              <div className="flex items-center gap-3">
                <div className={`${styles.formIcon} rounded-xl p-3`}><WarehouseIcon size={22} /></div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">{editing ? "Edit Warehouse" : "Add New Warehouse"}</h2>
                  <p className="text-sm text-slate-500">Enter the warehouse details below.</p>
                </div>
              </div>
              <button type="button" onClick={resetForm} disabled={saving} aria-label="Close form" className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"><X size={20} /></button>
            </div>

            <div className={`${styles.formFields} grid gap-5 p-5 sm:grid-cols-2 sm:p-6`}>
              <div>
                <label htmlFor="warehouse-code" className="mb-2 block text-sm font-semibold text-slate-700">Warehouse Code *</label>
                <input id="warehouse-code" value={code} onChange={(e) => setCode(e.target.value)} required maxLength={40} placeholder="e.g. WH-MUM-001" className="w-full rounded-xl border px-4 py-3 text-sm outline-none" />
              </div>
              <div>
                <label htmlFor="warehouse-name" className="mb-2 block text-sm font-semibold text-slate-700">Warehouse Name *</label>
                <input id="warehouse-name" value={name} onChange={(e) => setName(e.target.value)} required placeholder="e.g. Mumbai Central Warehouse" className="w-full rounded-xl border px-4 py-3 text-sm outline-none" />
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="warehouse-address" className="mb-2 block text-sm font-semibold text-slate-700">Address</label>
                <input id="warehouse-address" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="City, State, Country" className="w-full rounded-xl border px-4 py-3 text-sm outline-none" />
              </div>
              <p className="text-xs text-slate-400 sm:col-span-2">Fields marked with * are required. Warehouse code must be unique.</p>
            </div>

            <div className={`${styles.formFooter} flex flex-col-reverse justify-end gap-3 border-t border-slate-100 px-5 py-4 sm:flex-row sm:px-6`}>
              <button type="button" onClick={resetForm} disabled={saving} className={`${styles.actionButton} rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-100`}>Cancel</button>
              <button type="submit" disabled={saving || !code.trim() || !name.trim()} className={`${styles.primaryAction} inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50`}>
                {saving ? <><Loader2 size={17} className="animate-spin" /> Saving...</> : <><CheckCircle2 size={17} /> {editing ? "Update Warehouse" : "Save Warehouse"}</>}
              </button>
            </div>
          </form>
        </div>
      )}
    </main>
  );
}
