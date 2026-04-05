import { THEME_STORAGE_KEY } from "@/lib/theme";

/**
 * Senkron, ilk boyamadan önce çalışır: localStorage / sistem teması → data-theme.
 * layout.tsx <head> içinde inline script olarak eklenir (FOUC önler).
 */
export function getThemeBootstrapInlineScript(): string {
  const k = JSON.stringify(THEME_STORAGE_KEY);
  return `!function(){try{var k=${k},s=localStorage.getItem(k),t="light"===s||"dark"===s?s:null;null==t&&(t=window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"),document.documentElement.setAttribute("data-theme",t)}catch(e){document.documentElement.setAttribute("data-theme","dark")}}();`;
}
