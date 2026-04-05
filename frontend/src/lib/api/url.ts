/**
 * API istek adresi.
 * - Yerel / Docker: doğrudan FastAPI (NEXT_PUBLIC_API_URL veya 127.0.0.1:8000).
 * - Vercel + BACKEND_URL: aynı kök üzerinden /api-upstream/... (next.config rewrites → Render).
 */

function stripTrailingSlash(s: string): string {
  return s.replace(/\/$/, "");
}

/** Build sırasında BACKEND_URL varsa Next, client bundle'a proxy kullan demek için yazar. */
function useUpstreamProxy(): boolean {
  return process.env.NEXT_PUBLIC_API_PROXY === "1";
}

/**
 * @param apiPath FastAPI yolu, "/api/..." ile başlamalı (örn. "/api/meta").
 */
export function resolveApiUrl(apiPath: string): string {
  if (useUpstreamProxy()) {
    const sub = apiPath.replace(/^\/api\/?/, "");
    return `/api-upstream/${sub}`;
  }
  const base = stripTrailingSlash(
    process.env.NEXT_PUBLIC_API_URL?.trim() || "http://127.0.0.1:8000",
  );
  return `${base}${apiPath.startsWith("/") ? apiPath : `/${apiPath}`}`;
}

/** Eski çağrılar için; yeni kod resolveApiUrl kullanmalı. */
export function getApiBase(): string {
  if (useUpstreamProxy()) return "";
  return stripTrailingSlash(
    process.env.NEXT_PUBLIC_API_URL?.trim() || "http://127.0.0.1:8000",
  );
}
