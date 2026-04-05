"use client";

import { useCallback, useEffect, useState } from "react";
import { AppNavbar } from "@/components/layout/AppNavbar";
import { FeatureForm } from "@/components/predict/FeatureForm";
import { PredictionResultPanel } from "@/components/predict/PredictionResultPanel";
import { fetchFeatureMeta, fetchSampleBenignMeans, postPredict } from "@/lib/api";
import type { PredictionApiResponse } from "@/lib/types/api";
import { useLang } from "@/contexts/LangContext";

const FORM_ID = "predict-form";

export default function PredictView() {
  const { t, tf } = useLang();
  const [featureNames, setFeatureNames] = useState<string[]>([]);
  const [values, setValues] = useState<string[]>([]);
  const [result, setResult] = useState<PredictionApiResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    document.title = t("title.predict");
  }, [t]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const d = await fetchFeatureMeta();
        if (cancelled) return;
        setFeatureNames(d.feature_names);
        setValues(Array(d.feature_names.length).fill(""));
        setError(null);
      } catch (e) {
        if (!cancelled) {
          setError(
            `${t("predict.errStartup")} (${e instanceof Error ? e.message : String(e)})`,
          );
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [t]);

  const setVal = useCallback((i: number, v: string) => {
    setValues((prev) => {
      const next = [...prev];
      next[i] = v;
      return next;
    });
  }, []);

  const loadSample = async () => {
    setError(null);
    try {
      const d = await fetchSampleBenignMeans();
      setValues(d.features.map((x) => String(x)));
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  };

  const clearForm = () => {
    setValues(Array(featureNames.length).fill(""));
    setResult(null);
    setError(null);
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setResult(null);
    const nums = values.map((v) => parseFloat(v));
    if (nums.some((x) => Number.isNaN(x))) {
      setError(t("predict.errNumbers"));
      return;
    }
    try {
      const data = await postPredict(nums);
      setResult(data);
    } catch (err) {
      setError(
        `${t("predict.errRequest")}: ${err instanceof Error ? err.message : String(err)}`,
      );
    }
  };

  return (
    <div className="app-shell">
      <AppNavbar />

      <main className="main-content" id="main">
        <header className="hero">
          <p className="hero__eyebrow">{t("hero.eyebrow")}</p>
          <h1 className="hero__title">{t("predict.h1")}</h1>
          <p className="hero__lead">{t("predict.lead")}</p>
        </header>

        <section className="panel panel--form" aria-labelledby="form-heading">
          <div className="panel__head">
            <h2 className="panel__title" id="form-heading">
              {t("panel.featuresTitle")}
            </h2>
            <div className="toolbar">
              <button type="button" className="btn secondary" onClick={loadSample}>
                {t("predict.btnSample")}
              </button>
              <button type="button" className="btn ghost" onClick={clearForm}>
                {t("predict.btnClear")}
              </button>
            </div>
          </div>

          <FeatureForm
            formId={FORM_ID}
            featureNames={featureNames}
            values={values}
            labelFeature={tf}
            formAriaLabel={t("predict.formAria")}
            onSubmit={onSubmit}
            onChangeValue={setVal}
          />

          <div className="actions">
            <button type="submit" className="btn btn-submit" form={FORM_ID}>
              {t("predict.btnSubmit")}
            </button>
          </div>
        </section>

        {error && (
          <section className="alert alert--error" aria-live="polite">
            <p className="alert__text">{error}</p>
          </section>
        )}

        {result && !error && (
          <PredictionResultPanel
            title={t("predict.resultTitle")}
            labelMalignant={t("predict.labelMalignant")}
            labelBenign={t("predict.labelBenign")}
            barMalignant={t("predict.barMalignant")}
            barBenign={t("predict.barBenign")}
            result={result}
          />
        )}

        <footer className="site-footer">
          <p>{t("predict.footer")}</p>
        </footer>
      </main>
    </div>
  );
}
