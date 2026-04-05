/**
 * API istek adresi.
 * - Varsayılan: aynı kök üzerinden `/api/render/...` → sunucu Route Handler → `BACKEND_URL` (yerel/Vercel).
 * - İstisna: `NEXT_PUBLIC_API_URL` doluysa tarayıcı doğrudan o köke gider (nadir / Docker dışı senaryolar).
 */

function stripTrailingSlash(s: string): string {
  return s.replace(/\/$/, "");
}

function toRenderProxyPath(apiPath: string): string {
  const sub = apiPath.replace(/^\/api\/?/, "");
  return `/api/render/${sub}`;
}

/**
 * @param apiPath FastAPI yolu, "/api/..." ile başlamalı (örn. "/api/meta").
 */
export function resolveApiUrl(apiPath: string): string {
  const direct = process.env.NEXT_PUBLIC_API_URL?.trim();
  if (direct) {
    const base = stripTrailingSlash(direct);
    return `${base}${apiPath.startsWith("/") ? apiPath : `/${apiPath}`}`;
  }
  return toRenderProxyPath(apiPath);
}

/** Eski çağrılar için; yeni kod resolveApiUrl kullanmalı. */
export function getApiBase(): string {
  const direct = process.env.NEXT_PUBLIC_API_URL?.trim();
  if (direct) return stripTrailingSlash(direct);
  return "";
}
