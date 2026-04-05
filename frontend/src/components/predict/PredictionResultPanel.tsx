"use client";

type Props = {
  title: string;
  labelMalignant: string;
  labelBenign: string;
  barMalignant: string;
  barBenign: string;
  result: {
    label: string;
    probability_malignant: number;
    probability_benign: number;
  };
};

export function PredictionResultPanel({
  title,
  labelMalignant,
  labelBenign,
  barMalignant,
  barBenign,
  result,
}: Props) {
  const malPct = (result.probability_malignant * 100).toFixed(1);
  const benPct = (result.probability_benign * 100).toFixed(1);
  const isMal = result.label === "malignant";

  return (
    <section className="result-card" aria-live="polite">
      <h2 className="result-card__title">{title}</h2>
      <div className={`result-card__badge ${isMal ? "malignant" : "benign"}`}>
        {isMal ? labelMalignant : labelBenign}
      </div>
      <div className="result-card__bars">
        <div className="bar-row">
          <span className="bar-row__label">{barMalignant}</span>
          <div className="bar-bg">
            <div
              className="bar-fill malignant"
              style={{ width: `${malPct}%` }}
            />
          </div>
          <span className="bar-row__pct">{malPct}%</span>
        </div>
        <div className="bar-row">
          <span className="bar-row__label">{barBenign}</span>
          <div className="bar-bg">
            <div className="bar-fill benign" style={{ width: `${benPct}%` }} />
          </div>
          <span className="bar-row__pct">{benPct}%</span>
        </div>
      </div>
    </section>
  );
}
