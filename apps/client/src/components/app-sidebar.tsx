"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Boxes, ChartNoAxesCombined, ClipboardCheck, ClipboardList, LayoutDashboard, MapPin, Menu, Package, PackageCheck, PackagePlus, PanelLeftClose, PanelLeftOpen, Settings, ShieldCheck, Truck, Warehouse, X } from "lucide-react";
import { apiFetch } from "@/lib/api";

const navigation = [
  { href: "/", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/warehouses", icon: Warehouse, label: "Warehouses" },
  { href: "/locations", icon: MapPin, label: "Locations" },
  { href: "/inventory", icon: Boxes, label: "Inventory" },
  { href: "/products", icon: Package, label: "Products" },
  { href: "/suppliers", icon: Truck, label: "Suppliers" },
  { href: "/orders", icon: ClipboardList, label: "Orders" },
  { href: "/shipments", icon: Truck, label: "Shipments" },
  { href: "/reports", icon: ChartNoAxesCombined, label: "Reports" },
  { href: "/receiving", icon: PackageCheck, label: "Receiving / GRN", section: "Operations" },
  { href: "/stock-audits", icon: ClipboardCheck, label: "Stock Audit" },
  { href: "/replenishment", icon: PackagePlus, label: "Replenishment" },
  { href: "/admin", icon: ShieldCheck, label: "Admin Control", section: "Administration", adminOnly: true },
  { href: "/settings", icon: Settings, label: "Settings", section: "Administration", adminOnly: true },
];

function NavigationList({ onNavigate, isAdmin }: { onNavigate?: () => void; isAdmin: boolean }) {
  const pathname = usePathname();
  const items = navigation.filter((item) => !item.adminOnly || isAdmin);
  return <nav aria-label="Main navigation" className="flex-1 space-y-1 overflow-y-auto px-3 py-5">
    <p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-[2px] text-emerald-100/60">Workspace</p>
    {items.map((item, index) => {
      const active = pathname === item.href || (item.href !== "/" && pathname.startsWith(`${item.href}/`));
      return <div key={item.href}>
        {item.section && items[index - 1]?.section !== item.section && <p className="px-3 pb-2 pt-5 text-[10px] font-semibold uppercase tracking-[2px] text-emerald-100/60">{item.section}</p>}
        <Link href={item.href} onClick={onNavigate} aria-current={active ? "page" : undefined}
          className={`flex min-h-11 items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors ${active ? "bg-amber-300 font-semibold text-emerald-950" : "text-emerald-50/80 hover:bg-white/10 hover:text-white"}`}>
          <item.icon size={19} strokeWidth={1.8} className="shrink-0" />
          <span>{item.label}</span>
          {item.label === "Inventory" && <span className="ml-auto rounded-full bg-amber-200/20 px-2 py-0.5 text-xs text-amber-100">Stock</span>}
        </Link>
      </div>;
    })}
  </nav>;
}

function Brand({ onToggleDesktop }: { onToggleDesktop?: () => void }) {
  return <div className="flex h-[76px] shrink-0 items-center gap-3 border-b border-white/10 px-5">
    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-300 text-xl font-bold text-emerald-950">S</div>
    <div className="min-w-0 flex-1"><h1 className="text-lg font-bold tracking-wide text-white">SmartWMS</h1><p className="text-xs text-emerald-100/60">Warehouse Management</p></div>
    {onToggleDesktop && <button type="button" onClick={onToggleDesktop} aria-label="Hide sidebar" aria-expanded="true" title="Hide sidebar" className="hidden rounded-lg p-2 text-emerald-50/80 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-300 md:inline-flex"><PanelLeftClose size={19}/></button>}
  </div>;
}

function SidebarPanel({ onNavigate, isAdmin, onToggleDesktop }: { onNavigate?: () => void; isAdmin: boolean; onToggleDesktop?: () => void }) {
  return <div className="flex h-full flex-col bg-[#064e3b] text-white">
    <Brand onToggleDesktop={onToggleDesktop}/>
    <NavigationList onNavigate={onNavigate} isAdmin={isAdmin} />
    <div className="border-t border-white/10 px-5 py-4 text-xs text-emerald-100/60">Operations workspace</div>
  </div>;
}

export function AppSidebar({ desktopOpen, onToggleDesktop }: { desktopOpen: boolean; onToggleDesktop: () => void }) {
  const [open, setOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  useEffect(() => {
    let alive = true;
    apiFetch("/auth/me").then(async (response) => {
      if (!response.ok) return;
      const user = await response.json();
      if (alive) setIsAdmin(user.role === "ADMIN");
    }).catch(() => undefined);
    return () => { alive = false; };
  }, []);
  return <>
    <aside aria-hidden={!desktopOpen} inert={!desktopOpen} className={`fixed inset-y-0 left-0 z-40 hidden w-64 transform transition-transform duration-300 ease-in-out motion-reduce:transition-none md:block ${desktopOpen ? "translate-x-0" : "-translate-x-full"}`}><SidebarPanel isAdmin={isAdmin} onToggleDesktop={onToggleDesktop}/></aside>
    {!desktopOpen && <button type="button" onClick={onToggleDesktop} aria-label="Show sidebar" aria-expanded="false" title="Show sidebar" className="fixed left-4 top-4 z-50 hidden h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-emerald-900 shadow-md transition hover:-translate-y-0.5 hover:bg-emerald-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700 md:inline-flex"><PanelLeftOpen size={20}/></button>}
    <header className="fixed inset-x-0 top-0 z-40 flex h-14 items-center gap-3 border-b border-slate-200 bg-white px-4 shadow-sm md:hidden">
      <button type="button" aria-label="Open navigation" aria-expanded={open} onClick={() => setOpen(true)} className="rounded-lg p-2 text-slate-700 hover:bg-slate-100"><Menu size={21}/></button>
      <div className="flex items-center gap-2"><span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-800 font-bold text-amber-200">S</span><span className="font-semibold text-slate-900">SmartWMS</span></div>
    </header>
    {open && <div className="fixed inset-0 z-50 md:hidden">
      <button type="button" aria-label="Close navigation" className="absolute inset-0 bg-slate-950/50" onClick={() => setOpen(false)} />
      <aside className="absolute inset-y-0 left-0 flex w-[min(18rem,88vw)] flex-col shadow-2xl">
        <button type="button" aria-label="Close navigation" onClick={() => setOpen(false)} className="absolute right-3 top-5 z-10 rounded-lg p-2 text-white hover:bg-white/10"><X size={19}/></button>
        <SidebarPanel isAdmin={isAdmin} onNavigate={() => setOpen(false)} />
      </aside>
    </div>}
  </>;
}
