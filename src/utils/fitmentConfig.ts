import { DEFAULT_SETTINGS, type Settings } from "@/types/settings";
import type { FitmentConfig } from "@/types/stores";
import { isCarModel } from "@/constants/wheelPositions";
import { SPRING_MASS } from "./bounceSimulation";

// Saved garage rows and bookmarked links retain these names indefinitely.
const LEGACY_SETTING_KEYS: Readonly<Record<string, keyof Settings>> = {
  frontCamber: "frontCamberDeg",
  rearCamber: "rearCamberDeg",
  frontCaster: "frontCasterDeg",
  frontToe: "frontToeRad",
  rearToe: "rearToeRad",
  rideHeightFront: "rideHeightFrontFt",
  rideHeightRear: "rideHeightRearFt",
  frontTireWidth: "frontTireWidthMm",
  frontTireSidewall: "frontTireAspectRatio",
  frontWheelWidth: "frontWheelWidthIn",
  frontWheelDiameter: "frontWheelDiameterIn",
  frontWheelOffset: "frontWheelOffsetMm",
  frontWheelSpacer: "frontWheelSpacerMm",
  rearTireWidth: "rearTireWidthMm",
  rearTireSidewall: "rearTireAspectRatio",
  rearWheelWidth: "rearWheelWidthIn",
  rearWheelDiameter: "rearWheelDiameterIn",
  rearWheelOffset: "rearWheelOffsetMm",
  rearWheelSpacer: "rearWheelSpacerMm",
};

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

function currentSettings(input: unknown): Record<string, unknown> {
  const raw = record(input);
  const migrated = { ...raw };
  for (const [legacy, current] of Object.entries(LEGACY_SETTING_KEYS)) {
    if (raw[current] === undefined) migrated[current] = raw[legacy];
  }
  if (raw.springRateLbIn === undefined) {
    const frequencyHz = finiteNumber(raw.springRateHz);
    // Inverse of omega = sqrt(k / m), matching the original bounce model.
    if (frequencyHz !== undefined) {
      migrated.springRateLbIn = Math.round((2 * Math.PI * frequencyHz) ** 2 * SPRING_MASS);
    }
  }
  return migrated;
}

function completeSettings(input: unknown): Settings {
  const migrated = currentSettings(input);
  const settings = { ...DEFAULT_SETTINGS };
  for (const key of SETTINGS_KEYS) {
    settings[key] = finiteNumber(migrated[key]) ?? DEFAULT_SETTINGS[key];
  }
  return settings;
}

// Accepts both the model/settings envelope and legacy flat settings.
// Current keys take precedence; malformed values use defaults, never partial parses.
export function readFitmentConfig(input: unknown): FitmentConfig {
  const payload = record(input);
  const settings = "settings" in payload || "model" in payload ? payload.settings : payload;
  return {
    model: isCarModel(payload.model) ? payload.model : "na",
    settings: completeSettings(settings),
  };
}
