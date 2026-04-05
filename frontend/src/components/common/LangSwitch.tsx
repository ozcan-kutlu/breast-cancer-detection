"use client";

import { useLang } from "@/contexts/LangContext";

export function LangSwitch() {
  const { lang, setLang, t } = useLang();

  return (
    <div className="lang-switch" role="group" aria-label={t("lang.groupAria")}>
      <button
        type="button"
        className={`lang-btn ${lang === "tr" ? "active" : ""}`}
        onClick={() => setLang("tr")}
        aria-pressed={lang === "tr"}
      >
        TR
      </button>
      <button
        type="button"
        className={`lang-btn ${lang === "en" ? "active" : ""}`}
        onClick={() => setLang("en")}
        aria-pressed={lang === "en"}
      >
        EN
      </button>
    </div>
  );
}
