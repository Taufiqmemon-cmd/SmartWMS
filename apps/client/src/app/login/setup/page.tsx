"use client";
import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";

export default function AdminSetupPage() {
  const router = useRouter();
  const [name, setName] = useState(""); const [username, setUsername] = useState(""); const [email, setEmail] = useState("");
  const [password, setPassword] = useState(""); const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState(""); const [busy, setBusy] = useState(false);
  async function submit(event: FormEvent) {
    event.preventDefault(); setError("");
    if (password !== confirmPassword) { setError("Passwords do not match."); return; }
    setBusy(true);
    try {
      const response = await fetch("/api/admin/setup", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name, username, email, password }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Administrator setup failed");
      router.replace("/login");
    } catch (e) { setError(e instanceof Error ? e.message : "Administrator setup failed"); }
    finally { setBusy(false); }
  }
  return <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10"><section className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm"><p className="text-sm font-semibold text-emerald-800">SmartWMS · First-time setup</p><h1 className="mt-2 text-xl font-bold text-slate-900">Create administrator</h1><p className="mt-2 text-sm leading-6 text-slate-500">Create your administrator account. Setup is verified securely by the server.</p><form className="mt-6 space-y-4" onSubmit={submit}>
    <label className="block text-sm font-medium text-slate-700">Username<input required minLength={3} maxLength={32} pattern="[A-Za-z0-9._-]+" autoComplete="username" value={username} onChange={e=>setUsername(e.target.value)} className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2.5" /><span className="mt-1 block text-xs text-slate-500">3–32 letters, numbers, dots, underscores, or hyphens.</span></label>
    <label className="block text-sm font-medium text-slate-700">Full name<input required autoComplete="name" value={name} onChange={e=>setName(e.target.value)} className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2.5" /></label>
    <label className="block text-sm font-medium text-slate-700">Email<input required type="email" autoComplete="email" value={email} onChange={e=>setEmail(e.target.value)} className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2.5" /></label>
    <label className="block text-sm font-medium text-slate-700">Password<span className="relative mt-1.5 block"><input required minLength={12} type={showPassword ? "text" : "password"} autoComplete="new-password" value={password} onChange={e=>setPassword(e.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-2.5 pr-12" /><button type="button" aria-label={showPassword ? "Hide password" : "Show password"} onClick={()=>setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 flex items-center px-3 text-slate-500">{showPassword ? <EyeOff size={18}/> : <Eye size={18}/>}</button></span><span className="mt-1 block text-xs text-slate-500">Use at least 12 characters.</span></label>
    <label className="block text-sm font-medium text-slate-700">Confirm password<span className="relative mt-1.5 block"><input required minLength={12} type={showConfirm ? "text" : "password"} autoComplete="new-password" value={confirmPassword} onChange={e=>setConfirmPassword(e.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-2.5 pr-12" /><button type="button" aria-label={showConfirm ? "Hide confirmation" : "Show confirmation"} onClick={()=>setShowConfirm(!showConfirm)} className="absolute inset-y-0 right-0 flex items-center px-3 text-slate-500">{showConfirm ? <EyeOff size={18}/> : <Eye size={18}/>}</button></span></label>
    {error && <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}<button disabled={busy} className="w-full rounded-lg bg-emerald-800 px-4 py-2.5 font-semibold text-white disabled:opacity-60">{busy ? "Creating account…" : "Create administrator"}</button></form><Link className="mt-5 block text-center text-sm text-emerald-800 hover:underline" href="/login">Return to sign in</Link></section></main>;
}
