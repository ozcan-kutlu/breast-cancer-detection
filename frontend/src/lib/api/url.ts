/**
 * API kökü: build/runtime’da NEXT_PUBLIC_API_URL (Vercel + Render için zorunlu).
 * Yerelde boşsa http://127.0.0.1:8000.
 */

function stripTrailingSlash(s: string): string {
  return s.replace(/\/$/, "");
}

const defaultLocal = "http://127.0.0.1:8000";

function apiBase(): string {
  return stripTrailingSlash(
    process.env.NEXT_PUBLIC_API_URL?.trim() || defaultLocal,
  );
}

/**
 * @param apiPath "/api/..." (örn. "/api/meta")
 */
export function resolveApiUrl(apiPath: string): string {
  const base = apiBase();
  return `${base}${apiPath.startsWith("/") ? apiPath : `/${apiPath}`}`;
}

export function getApiBase(): string {
  return apiBase();
}
