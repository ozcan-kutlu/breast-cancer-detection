/**
 * API istek adresi.
 * - Yerel: doğrudan FastAPI (NEXT_PUBLIC_API_URL veya 127.0.0.1:8000).
 * - Canlı (vercel.app vb.): /api/render/... → Route Handler → Render (BACKEND_URL).
 */

function stripTrailingSlash(s: string): string {
  return s.replace(/\/$/, "");
}

function useUpstreamProxyFlag(): boolean {
  return process.env.NEXT_PUBLIC_API_PROXY === "1";
}

/** Tarayıcıda localhost dışındaysa her zaman aynı kök üzerinden proxy (build’de env kaçsa kaçsın). */
function useUpstreamOnDeployedHost(): boolean {
  if (typeof window === "undefined") return false;
  const h = window.location.hostname;
  return h !== "localhost" && h !== "127.0.0.1";
}

function useUpstream(): boolean {
  return useUpstreamProxyFlag() || useUpstreamOnDeployedHost();
}

function toUpstreamPath(apiPath: string): string {
  const sub = apiPath.replace(/^\/api\/?/, "");
  return `/api/render/${sub}`;
}

/**
 * @param apiPath FastAPI yolu, "/api/..." ile başlamalı (örn. "/api/meta").
 */
export function resolveApiUrl(apiPath: string): string {
  if (useUpstream()) {
    return toUpstreamPath(apiPath);
  }
  const base = stripTrailingSlash(
    process.env.NEXT_PUBLIC_API_URL?.trim() || "http://127.0.0.1:8000",
  );
  return `${base}${apiPath.startsWith("/") ? apiPath : `/${apiPath}`}`;
}

/** Eski çağrılar için; yeni kod resolveApiUrl kullanmalı. */
export function getApiBase(): string {
  if (useUpstream()) return "";
  return stripTrailingSlash(
    process.env.NEXT_PUBLIC_API_URL?.trim() || "http://127.0.0.1:8000",
  );
}
