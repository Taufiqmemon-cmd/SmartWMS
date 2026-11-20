"use client";
import { apiFetch } from "@/lib/api";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState(""); const [password, setPassword] = useState("");
  const [error, setError] = useState(""); const [busy, setBusy] = useState(false);
  async function submit(event: FormEvent) {
    event.preventDefault(); setBusy(true); setError("");
    try { const response = await apiFetch("/auth/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ identifier, password }) }); const data = await response.json(); if (!response.ok) throw new Error(data.message || "Login failed"); const next = new URLSearchParams(window.location.search).get("next"); router.replace(next?.startsWith("/") && !next.startsWith("//") ? next : "/"); }
    catch (e) { setError(e instanceof Error ? e.message : "Unable to sign in"); } finally { setBusy(false); }
  }
  return <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10"><section className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm"><div className="mb-7 flex items-center gap-3"><div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-800 text-xl font-bold text-white">S</div><div><h1 className="text-xl font-bold text-slate-900">SmartWMS</h1><p className="text-sm text-slate-500">Secure warehouse access</p></div></div><h2 className="text-lg font-semibold text-slate-900">Sign in</h2><p className="mt-1 text-sm text-slate-500">Use your SmartWMS account to continue.</p><form className="mt-6 space-y-4" onSubmit={submit}><label className="block text-sm font-medium text-slate-700">Username or email<input required autoComplete="username" value={identifier} onChange={e=>setIdentifier(e.target.value)} className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-emerald-700 focus:ring-2 focus:ring-emerald-100" /></label><label className="block text-sm font-medium text-slate-700">Password<input required type="password" autoComplete="current-password" value={password} onChange={e=>setPassword(e.target.value)} className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-emerald-700 focus:ring-2 focus:ring-emerald-100" /></label>{error && <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}<button disabled={busy} className="w-full rounded-lg bg-emerald-800 px-4 py-2.5 font-semibold text-white hover:bg-emerald-900 disabled:opacity-60">{busy ? "Signing in…" : "Sign in"}</button></form><p className="mt-6 text-center text-sm text-slate-500">First-time administrator? <Link className="font-medium text-emerald-800 hover:underline" href="/login/setup">Set up securely</Link></p></section></main>;
}
