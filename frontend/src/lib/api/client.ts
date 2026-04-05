import type {
  FeatureMetaResponse,
  PredictionApiResponse,
  SampleBenignResponse,
} from "@/lib/types/api";
import { getApiBase } from "@/lib/api/url";

async function parseJsonOrThrow<T>(response: Response): Promise<T> {
  return response.json() as Promise<T>;
}

export async function fetchFeatureMeta(): Promise<FeatureMetaResponse> {
  const base = getApiBase();
  const r = await fetch(`${base}/api/meta`);
  if (!r.ok) throw new Error(`meta ${r.status}`);
  return parseJsonOrThrow(r);
}

export async function fetchSampleBenignMeans(): Promise<SampleBenignResponse> {
  const base = getApiBase();
  const r = await fetch(`${base}/api/sample-benign-means`);
  if (!r.ok) throw new Error(`sample ${r.status}`);
  return parseJsonOrThrow(r);
}

export async function postPredict(
  features: number[],
): Promise<PredictionApiResponse> {
  const base = getApiBase();
  const r = await fetch(`${base}/api/predict`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ features }),
  });
  const data = await r.json();
  if (!r.ok) {
    const detail =
      typeof data.detail === "string"
        ? data.detail
        : JSON.stringify(data.detail ?? r.statusText);
    throw new Error(detail);
  }
  return data as PredictionApiResponse;
}
