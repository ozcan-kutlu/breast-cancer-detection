/** Tarayıcıdan FastAPI’ye giden taban URL (build’de NEXT_PUBLIC_API_URL). */

export function getApiBase(): string {
  const raw =
    process.env.NEXT_PUBLIC_API_URL?.trim() || "http://127.0.0.1:8000";
  return raw.replace(/\/$/, "");
}
