import { readCarAppearance } from "./carAppearance";
import { DEFAULT_SETTINGS, type Settings } from "@/types/settings";
import type { FitmentConfig } from "@/types/stores";
import { isCarModel } from "@/constants/wheelPositions";

const SETTINGS_KEYS = Object.keys(DEFAULT_SETTINGS) as (keyof Settings)[];

function record(input: unknown): Record<string, unknown> {
  return input !== null && typeof input === "object" && !Array.isArray(input)
    ? input as Record<string, unknown>
    : {};
}

function finiteNumber(value: unknown): number | undefined {
  if (typeof value !== "number" && typeof value !== "string") return undefined;
  if (typeof value === "string" && !value.trim()) return undefined;
  const number = Number(value);
  return Number.isFinite(number) ? number : undefined;
}

function completeSettings(input: unknown): Settings {
  const raw = record(input);
  const settings = { ...DEFAULT_SETTINGS };
  for (const key of SETTINGS_KEYS) {
    settings[key] = finiteNumber(raw[key]) ?? DEFAULT_SETTINGS[key];
  }
  return settings;
}

export function readFitmentConfig(input: unknown): FitmentConfig {
  const payload = record(input);
  const model = isCarModel(payload.model) ? payload.model : "na";
  return {
    model,
    appearance: readCarAppearance(model, payload.appearance),
    settings: completeSettings(payload.settings),
  };
}
