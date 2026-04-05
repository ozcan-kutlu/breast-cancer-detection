export type Theme = "light" | "dark";

export const THEME_STORAGE_KEY = "bc_theme";

export function readStoredTheme(): Theme | null {
  if (typeof window === "undefined") return null;
  const s = localStorage.getItem(THEME_STORAGE_KEY);
  return s === "light" || s === "dark" ? s : null;
}

export function getSystemTheme(): Theme {
  if (typeof window === "undefined") return "dark";
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}
