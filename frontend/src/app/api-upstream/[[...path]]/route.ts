import { NextRequest, NextResponse } from "next/server";

function backendBase(): string | null {
  const u = process.env.BACKEND_URL?.trim().replace(/\/$/, "");
  return u || null;
}

const HOP_SKIP = new Set([
  "connection",
  "keep-alive",
  "transfer-encoding",
  "te",
  "trailer",
  "upgrade",
  "host",
]);

function forwardHeaders(incoming: Headers): Headers {
  const out = new Headers();
  incoming.forEach((value, key) => {
    if (!HOP_SKIP.has(key.toLowerCase())) out.set(key, value);
  });
  return out;
}

function sanitizeResponseHeaders(h: Headers): Headers {
  const out = new Headers(h);
  for (const k of ["connection", "keep-alive", "transfer-encoding", "trailer"]) {
    out.delete(k);
  }
  return out;
}

async function proxy(req: NextRequest, segments: string[] | undefined) {
  const base = backendBase();
  if (!base) {
    return NextResponse.json(
      { detail: "BACKEND_URL is not configured on the server" },
      { status: 503 },
    );
  }

  const suffix = segments?.length ? segments.join("/") : "";
  const apiPath = suffix ? `/api/${suffix}` : "/api";
  const target = new URL(apiPath + req.nextUrl.search, `${base}/`);

  const init: RequestInit = {
    method: req.method,
    headers: forwardHeaders(req.headers),
    cache: "no-store",
  };

  if (req.method !== "GET" && req.method !== "HEAD") {
    init.body = await req.arrayBuffer();
  }

  const upstream = await fetch(target, init);
  return new NextResponse(upstream.body, {
    status: upstream.status,
    statusText: upstream.statusText,
    headers: sanitizeResponseHeaders(upstream.headers),
  });
}

export async function GET(
  req: NextRequest,
  ctx: { params: Promise<{ path?: string[] }> },
) {
  const { path } = await ctx.params;
  return proxy(req, path);
}

export async function POST(
  req: NextRequest,
  ctx: { params: Promise<{ path?: string[] }> },
) {
  const { path } = await ctx.params;
  return proxy(req, path);
}
