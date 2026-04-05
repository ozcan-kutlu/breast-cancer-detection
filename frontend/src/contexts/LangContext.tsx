"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  STORAGE_KEY,
  translate,
  translateFeatureName,
  type Lang,
} from "@/lib/strings";

type Ctx = {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: string) => string;
  tf: (englishFeature: string) => string;
};

const LangContext = createContext<Ctx | null>(null);

export function LangProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("tr");

  useEffect(() => {
    const s = localStorage.getItem(STORAGE_KEY);
    setLangState(s === "en" ? "en" : "tr");
  }, []);

  const setLang = useCallback((l: Lang) => {
    localStorage.setItem(STORAGE_KEY, l);
    setLangState(l);
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const t = useCallback((key: string) => translate(lang, key), [lang]);
  const tf = useCallback(
    (name: string) => translateFeatureName(lang, name),
    [lang],
  );

  const value = useMemo(
    () => ({ lang, setLang, t, tf }),
    [lang, setLang, t, tf],
  );

  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

export function useLang() {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error("useLang must be used within LangProvider");
  return ctx;
}
