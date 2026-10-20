import { readCarAppearance } from "@/utils/carAppearance";
import { resolveBodyParts } from "@/constants/bodyParts";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { DEFAULT_SETTINGS } from "@/types/settings";
import type { CarModel } from "@/constants/wheelPositions";
import { DEFAULT_WHEEL_DESIGN, WHEEL_DESIGNS } from "@/constants/wheelDesigns";
import type { FitmentStore } from "@/types/stores";
import type { Settings } from "@/types/settings";
import { readFitmentConfig } from "@/utils/fitmentConfig";

export type { CarModel };

type SettingPair = readonly [keyof Settings, keyof Settings];

// The front/rear pairs each match toggle keeps equal. A new paired setting has
// to be listed here too, or the toggle will quietly leave it unmatched.
const MATCHED_WHEEL_KEYS: readonly SettingPair[] = [
  ["frontWheelWidthIn", "rearWheelWidthIn"],
  ["frontWheelDiameterIn", "rearWheelDiameterIn"],
  ["frontWheelOffsetMm", "rearWheelOffsetMm"],
  ["frontWheelSpacerMm", "rearWheelSpacerMm"],
];

const MATCHED_TIRE_KEYS: readonly SettingPair[] = [
  ["frontTireWidthMm", "rearTireWidthMm"],
  ["frontTireAspectRatio", "rearTireAspectRatio"],
];

function mirrorToRear(
  settings: Settings,
  pairs: readonly SettingPair[],
): Settings {
  const mirrored = { ...settings };
  for (const [front, rear] of pairs) mirrored[rear] = settings[front];
  return mirrored;
}

// Applied on every write rather than from an effect watching the front values,
// so the rear can never be briefly out of step with the front.
function applyMatching(
  settings: Settings,
  matchWheels: boolean,
  matchTires: boolean,
): Settings {
  let matched = settings;
  if (matchWheels) matched = mirrorToRear(matched, MATCHED_WHEEL_KEYS);
  if (matchTires) matched = mirrorToRear(matched, MATCHED_TIRE_KEYS);
  return matched;
}

export const useFitmentStore = create<FitmentStore>()(
  persist(
    (set) => ({
      model: "na",
      appearance: readCarAppearance("na", undefined),
      settings: DEFAULT_SETTINGS,
      wheelDesign: DEFAULT_WHEEL_DESIGN,
      matchWheels: false,
      matchTires: false,

      setModel: (model) => set((state) => ({
        model, appearance: readCarAppearance(model, state.appearance),
      })),
      setBodyPart: (slot, value) => set((state) => ({
        appearance: { ...state.appearance, parts: resolveBodyParts(state.model, state.appearance.parts, { slot, value }) },
      })),
      setCarColor: (hex) => set((state) => ({
        appearance: readCarAppearance(state.model, { ...state.appearance, paint: { ...state.appearance.paint, hex } }),
      })),
      setCarMetallic: (metallic) => set((state) => ({
        appearance: { ...state.appearance, paint: { ...state.appearance.paint, metallic } },
      })),

      setWheelDesign: (design) => set({ wheelDesign: design }),

      updateSettings: (patch) =>
        set((state) => ({
          settings: applyMatching(
            { ...state.settings, ...patch },
            state.matchWheels,
            state.matchTires,
          ),
        })),

      resetSettings: () => set({ settings: DEFAULT_SETTINGS }),

      loadConfig: (config) =>
        set((state) => ({
          model: config.model,
          appearance: readCarAppearance(config.model, config.appearance),
          settings: applyMatching(
            config.settings,
            state.matchWheels,
            state.matchTires,
          ),
        })),

      setMatchWheels: (match) =>
        set((state) => ({
          matchWheels: match,
          settings: match
            ? mirrorToRear(state.settings, MATCHED_WHEEL_KEYS)
            : state.settings,
        })),

      setMatchTires: (match) =>
        set((state) => ({
          matchTires: match,
          settings: match
            ? mirrorToRear(state.settings, MATCHED_TIRE_KEYS)
            : state.settings,
        })),
    }),
    {
      name: "fitment-storage",
      merge: (persistedState, currentState) => {
        if (!persistedState || typeof persistedState !== "object" || Array.isArray(persistedState)) {
          return currentState;
        }
        const persisted = persistedState as Record<string, unknown>;
        const config = readFitmentConfig(persisted);
        const wheelDesign = WHEEL_DESIGNS.find((design) => design.value === persisted.wheelDesign);
        const matchWheels = typeof persisted.matchWheels === "boolean"
          ? persisted.matchWheels : currentState.matchWheels;
        const matchTires = typeof persisted.matchTires === "boolean"
          ? persisted.matchTires : currentState.matchTires;

        return {
          ...currentState,
          ...config,
          wheelDesign: wheelDesign?.value ?? currentState.wheelDesign,
          matchWheels,
          matchTires,
          settings: applyMatching(config.settings, matchWheels, matchTires),
        };
      },
    }
  )
);
