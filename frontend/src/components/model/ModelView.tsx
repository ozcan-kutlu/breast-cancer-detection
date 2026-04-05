"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { LangSwitch } from "@/components/common/LangSwitch";
import { DecisionTreeImage } from "@/components/model/DecisionTreeImage";
import { fetchModelInfo, treePngUrl } from "@/lib/api";
import type { ModelInfoResponse } from "@/lib/types/api";
import { useLang } from "@/contexts/LangContext";

function translateClassList(classes: string[], t: (k: string) => string) {
  return classes
    .map((c) => {
      if (c === "malignant") return t("model.classMalignant");
      if (c === "benign") return t("model.classBenign");
      return c;
    })
    .join(", ");
}

export default function ModelView() {
  const { t, tf, lang } = useLang();
  const [info, setInfo] = useState<ModelInfoResponse | null>(null);
  const [loadErr, setLoadErr] = useState<string | null>(null);
  const [treeErr, setTreeErr] = useState(false);

  const treeSrc = treePngUrl();

  useEffect(() => {
    document.title = t("title.model");
  }, [t, lang]);

  useEffect(() => {
    setTreeErr(false);
  }, [lang]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await fetchModelInfo();
        if (cancelled) return;
        setInfo(data);
        setLoadErr(null);
      } catch (e) {
        if (!cancelled) {
          setLoadErr(e instanceof Error ? e.message : String(e));
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const depthLabel =
    info?.max_depth === null || info?.max_depth === undefined
      ? t("model.depthUnlimited")
      : String(info.max_depth);

  const maxImp = info
    ? Math.max(...info.feature_importance.map((x) => x.importance), 1e-9)
    : 1;

  return (
    <div className="page">
      <nav className="nav-top">
        <Link href="/">{t("nav.predictLink")}</Link>
        <LangSwitch />
      </nav>

      <header className="header">
        <h1>{t("model.h1")}</h1>
        <p
          className="lead"
          dangerouslySetInnerHTML={{ __html: t("model.leadHtml") }}
        />
      </header>

      {loadErr && (
        <section className="model-meta">
          <p className="error">{loadErr}</p>
        </section>
      )}

      {info && (
        <section className="model-meta" aria-live="polite">
          <ul className="meta-list">
            <li>
              <strong>{t("model.metaAlgorithm")}:</strong> {info.algorithm}
            </li>
            <li>
              <strong>{t("model.metaEstimators")}:</strong> {info.n_estimators}
            </li>
            <li>
              <strong>{t("model.metaMaxDepth")}:</strong> {depthLabel}
            </li>
            <li>
              <strong>{t("model.metaNFeatures")}:</strong> {info.n_features_in}
            </li>
            <li>
              <strong>{t("model.metaClasses")}:</strong>{" "}
              {translateClassList(info.classes, t)}
            </li>
          </ul>
        </section>
      )}

      <section className="viz-section">
        <h2 className="viz-title">{t("model.sectionImportance")}</h2>
        <div className="importance-list">
          {info?.feature_importance.map((row) => {
            const pct = (row.importance / maxImp) * 100;
            return (
              <div key={row.name} className="imp-row">
                <span className="imp-name">{tf(row.name)}</span>
                <div className="imp-bar-bg">
                  <div className="imp-bar-fill" style={{ width: `${pct}%` }} />
                </div>
                <span className="imp-val">{row.importance.toFixed(4)}</span>
              </div>
            );
          })}
        </div>
      </section>

      <section className="viz-section">
        <h2 className="viz-title">{t("model.sectionTree")}</h2>
        <p className="viz-note">{t("model.treeNote")}</p>
        <div className="tree-wrap">
          {!treeErr && (
            <DecisionTreeImage
              src={treeSrc}
              alt={t("model.treeAlt")}
              imageKey={`${treeSrc}-${lang}`}
              onFail={() => setTreeErr(true)}
            />
          )}
          {treeErr && <p className="error">{t("model.treeLoadError")}</p>}
        </div>
      </section>

      <footer className="footer">
        <p>{t("model.footer")}</p>
      </footer>
    </div>
  );
}
