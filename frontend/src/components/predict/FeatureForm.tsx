"use client";

type Props = {
  formId: string;
  featureNames: string[];
  values: string[];
  labelFeature: (name: string) => string;
  formAriaLabel: string;
  onSubmit: (e: React.FormEvent) => void;
  onChangeValue: (index: number, value: string) => void;
};

export function FeatureForm({
  formId,
  featureNames,
  values,
  labelFeature,
  formAriaLabel,
  onSubmit,
  onChangeValue,
}: Props) {
  return (
    <form
      id={formId}
      className="form-grid"
      aria-label={formAriaLabel}
      onSubmit={onSubmit}
    >
      {featureNames.map((name, i) => (
        <div key={name} className="field field-card">
          <label htmlFor={`f-${i}`}>{labelFeature(name)}</label>
          <input
            id={`f-${i}`}
            type="number"
            step="any"
            required
            value={values[i] ?? ""}
            onChange={(e) => onChangeValue(i, e.target.value)}
          />
        </div>
      ))}
    </form>
  );
}
