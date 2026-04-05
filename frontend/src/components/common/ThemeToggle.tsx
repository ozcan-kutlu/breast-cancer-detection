"use client";

import { useLang } from "@/contexts/LangContext";
import { useTheme } from "@/contexts/ThemeContext";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const { t } = useLang();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={toggleTheme}
      aria-label={t("theme.ariaToggle")}
      title={isDark ? t("theme.toLight") : t("theme.toDark")}
    >
      <span className="theme-toggle__track" aria-hidden>
        <span className="theme-toggle__thumb">
          {isDark ? <IconMoon /> : <IconSun />}
        </span>
      </span>
    </button>
  );
}

function IconSun() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2" />
      <path
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"
      />
    </svg>
  );
}

function IconMoon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
