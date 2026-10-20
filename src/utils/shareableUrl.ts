import type { FitmentConfig } from "@/types/stores";
import { isCarModel } from "@/constants/wheelPositions";
import { readFitmentConfig } from "./fitmentConfig";

export function buildShareUrl(config: FitmentConfig): string {
  const params = new URLSearchParams();
  params.set("model", config.model);
  params.set("appearance", JSON.stringify(config.appearance));
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
  let appearance: unknown;
  try {
    appearance = JSON.parse(searchParams.get("appearance") ?? "null");
  } catch {
    appearance = undefined;
  }
  return readFitmentConfig({ model, settings, appearance });
}
