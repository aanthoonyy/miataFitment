import type { FitmentConfig } from "@/types/stores";
import { isCarModel } from "@/constants/wheelPositions";
import { readFitmentConfig } from "./fitmentConfig";

export function buildShareUrl(config: FitmentConfig): string {
  const params = new URLSearchParams();
  params.set("model", config.model);
  for (const [key, value] of Object.entries(config.settings)) {
    params.set(key, String(value));
  }
  return `${window.location.origin}/visualizer?${params.toString()}`;
}

export function parseShareParams(
  searchParams: URLSearchParams
): FitmentConfig | null {
  const model = searchParams.get("model");
  if (!isCarModel(model)) return null;

  const settings: Record<string, string> = {};
  searchParams.forEach((value, key) => {
    if (!(key in settings)) settings[key] = value;
  });
  return readFitmentConfig({ model, settings });
}
