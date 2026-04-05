"use client";

import { LangSwitch } from "@/components/common/LangSwitch";
import { ThemeToggle } from "@/components/common/ThemeToggle";
import { useLang } from "@/contexts/LangContext";

export function AppNavbar() {
  const { t } = useLang();

  return (
    <header className="site-header">
      <div className="site-header__inner">
        <div className="site-brand">
          <span className="site-brand__mark" aria-hidden />
          <div className="site-brand__text">
            <span className="site-brand__name">{t("nav.brand")}</span>
            <span className="site-brand__tagline">{t("nav.tagline")}</span>
          </div>
        </div>
        <nav className="site-nav" aria-label={t("nav.ariaMain")}>
          <span className="site-nav__pill" title={t("nav.currentHint")}>
            {t("nav.currentPage")}
          </span>
          <ThemeToggle />
          <LangSwitch />
        </nav>
      </div>
    </header>
  );
}
