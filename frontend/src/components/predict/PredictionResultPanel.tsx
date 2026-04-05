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
    <section className="result" aria-live="polite">
      <h2>{title}</h2>
      <div className={`badge ${isMal ? "malignant" : "benign"}`}>
        {isMal ? labelMalignant : labelBenign}
      </div>
      <div className="bars">
        <div className="bar-row">
          <span>{barMalignant}</span>
          <div className="bar-bg">
            <div
              className="bar-fill malignant"
              style={{ width: `${malPct}%` }}
            />
          </div>
          <span>{malPct}%</span>
        </div>
        <div className="bar-row">
          <span>{barBenign}</span>
          <div className="bar-bg">
            <div className="bar-fill benign" style={{ width: `${benPct}%` }} />
          </div>
          <span>{benPct}%</span>
        </div>
      </div>
    </section>
  );
}
