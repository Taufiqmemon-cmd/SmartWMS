function apiBase() {
  const configured = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4001";
  if (typeof window === "undefined") return configured;
  try {
    const target = new URL(configured);
    const localHost = ["localhost", "127.0.0.1", "::1"].includes(target.hostname);
    if (localHost && !["localhost", "127.0.0.1", "::1"].includes(window.location.hostname)) {
      return window.location.protocol + "//" + window.location.hostname + ":" + (target.port || "4001");
    }
  } catch { /* use the configured address below */ }
  return configured;
}

export function apiUrl(path: string) { return path.startsWith("http://") || path.startsWith("https://") ? path : apiBase() + path; }

export function apiFetch(path: string, init: RequestInit = {}) {
  return fetch(apiUrl(path), { ...init, credentials: "include" });
}
