import { NextResponse } from "next/server";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

async function bootstrapToken() {
  if (process.env.ADMIN_BOOTSTRAP_TOKEN) return process.env.ADMIN_BOOTSTRAP_TOKEN;
  try {
    const apiEnv = await readFile(resolve(process.cwd(), "../backend/.env"), "utf8");
    const value = apiEnv.split(/\r?\n/)
      .map((line) => line.match(/^\s*ADMIN_BOOTSTRAP_TOKEN\s*=\s*(.*?)\s*$/)?.[1])
      .filter((entry): entry is string => Boolean(entry?.trim()))
      .at(-1);
    return value?.replace(/^(["'])(.*)\1$/, "$2");
  } catch { return undefined; }
}

export async function POST(request: Request) {
  const token = await bootstrapToken();
  if (!token || token.length < 32) {
    return NextResponse.json({ message: "Administrator setup is not configured on the web server." }, { status: 503 });
  }
  try {
    const body = await request.json();
    const api = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4001";
    const upstream = await fetch(`${api}/auth/bootstrap`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-admin-bootstrap-token": token },
      body: JSON.stringify(body),
      cache: "no-store",
    });
    const text = await upstream.text();
    if (upstream.status === 404 && text.includes("Cannot POST /auth/bootstrap")) {
      return NextResponse.json({ message: "The API running on port 4001 is an older version. Restart the backend with: npm run backend. Then retry setup." }, { status: 502 });
    }
    return new NextResponse(text, { status: upstream.status, headers: { "Content-Type": upstream.headers.get("content-type") || "application/json" } });
  } catch {
    return NextResponse.json({ message: "Could not reach the SmartWMS API. Make sure the backend is running on port 4001." }, { status: 502 });
  }
}
