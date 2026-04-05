/** FastAPI ile uyumlu istemci tipleri */

export type FeatureMetaResponse = {
  feature_names: string[];
  n_features: number;
  target_names: string[];
  description: string;
};

export type SampleBenignResponse = {
  features: number[];
};

export type PredictionApiResponse = {
  label: string;
  label_code: number;
  probability_malignant: number;
  probability_benign: number;
};
