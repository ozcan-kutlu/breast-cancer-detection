"use client";

import {
  createContext,
  useCallback,
  useContext,
  useLayoutEffect,
  useMemo,
  useState,
} from "react";
import {
  getSystemTheme,
  readStoredTheme,
  THEME_STORAGE_KEY,
  type Theme,
} from "@/lib/theme";

type Ctx = {
  theme: Theme;
  setTheme: (t: Theme) => void;
  toggleTheme: () => void;
};

const ThemeContext = createContext<Ctx | null>(null);

function applyDomTheme(t: Theme) {
  document.documentElement.setAttribute("data-theme", t);
}

function readThemeFromDocument(): Theme | null {
  if (typeof document === "undefined") return null;
  const v = document.documentElement.getAttribute("data-theme");
  return v === "light" || v === "dark" ? v : null;
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("dark");

  useLayoutEffect(() => {
    const fromDom = readThemeFromDocument();
    if (fromDom) {
      setThemeState(fromDom);
      return;
    }
    const stored = readStoredTheme();
    const initial = stored ?? getSystemTheme();
    setThemeState(initial);
    applyDomTheme(initial);
  }, []);

  const setTheme = useCallback((t: Theme) => {
    localStorage.setItem(THEME_STORAGE_KEY, t);
    setThemeState(t);
    applyDomTheme(t);
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeState((prev) => {
      const next = prev === "dark" ? "light" : "dark";
      localStorage.setItem(THEME_STORAGE_KEY, next);
      applyDomTheme(next);
      return next;
    });
  }, []);

  const value = useMemo(
    () => ({ theme, setTheme, toggleTheme }),
    [theme, setTheme, toggleTheme],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
