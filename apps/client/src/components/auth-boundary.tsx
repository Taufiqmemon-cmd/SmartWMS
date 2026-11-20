"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import { AppSidebar } from "@/components/app-sidebar";

export function AuthBoundary({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [verifiedPath, setVerifiedPath] = useState<string | null>(null);
  const [desktopSidebarOpen, setDesktopSidebarOpen] = useState(true);
  const publicPage = pathname.startsWith("/login");
  const ready = publicPage || verifiedPath === pathname;
  useEffect(() => {
    if (publicPage) return;
    let alive = true;
    apiFetch("/auth/me").then((response) => {
      if (alive && response.ok) setVerifiedPath(pathname);
      else if (alive) router.replace(`/login?next=${encodeURIComponent(pathname)}`);
    }).catch(() => { if (alive) router.replace(`/login?next=${encodeURIComponent(pathname)}`); });
    return () => { alive = false; };
  }, [pathname, publicPage, router]);
  if (publicPage) return children;
  return <>
    <AppSidebar desktopOpen={desktopSidebarOpen} onToggleDesktop={() => setDesktopSidebarOpen((open) => !open)} />
    <div className={`min-h-screen pt-14 transition-[margin] duration-300 ease-in-out motion-reduce:transition-none md:pt-0 ${desktopSidebarOpen ? "md:ml-64" : "md:ml-0"} ${ready ? "" : "invisible pointer-events-none"}`} aria-hidden={!ready}>{children}</div>
    {!ready && <main role="status" className="fixed inset-0 z-40 flex items-center justify-center bg-slate-50 text-sm text-slate-500">Checking your secure session…</main>}
    {ready && <button className="fixed bottom-4 right-4 z-50 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 shadow-sm hover:bg-slate-50" onClick={async () => { await apiFetch("/auth/logout", { method: "POST" }); router.replace("/login"); }}>Sign out</button>}
  </>;
}
