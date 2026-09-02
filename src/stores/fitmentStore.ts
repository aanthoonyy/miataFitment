import { create } from "zustand";
import { persist } from "zustand/middleware";
import { DEFAULT_SETTINGS } from "@/types/settings";
import type { CarModel } from "@/constants/wheelPositions";
import { DEFAULT_WHEEL_DESIGN } from "@/constants/wheelDesigns";
import { DEFAULT_BODY_PARTS } from "@/constants/bodyParts";
import { SPRING_MASS } from "@/utils/bounceSimulation";
import type { FitmentStore } from "@/types/stores";
import type { Settings } from "@/types/settings";
import { withCurrentSettingKeys } from "@/utils/settingsMigration";

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
      settings: DEFAULT_SETTINGS,
      wheelDesign: DEFAULT_WHEEL_DESIGN,
      bodyParts: DEFAULT_BODY_PARTS,
      matchWheels: false,
      matchTires: false,

      setModel: (model) => set({ model }),

      setWheelDesign: (design) => set({ wheelDesign: design }),

      setBodyPart: (slot, value) =>
        set((state) => ({ bodyParts: { ...state.bodyParts, [slot]: value } })),

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
        const typedState = persistedState as FitmentStore | undefined;
        if (!typedState) return currentState;

        const persisted = withCurrentSettingKeys(
          typedState.settings as unknown as Record<string, unknown>,
        );

        const legacyHz = persisted.springRateHz;
        // Inverse of omega = sqrt(k / m) — recover lb/in from a legacy Hz value.
        const legacySpringRateLbIn =
          typeof legacyHz === "number" && Number.isFinite(legacyHz)
            ? Math.round(Math.pow(2 * Math.PI * legacyHz, 2) * SPRING_MASS)
            : undefined;

        return {
          ...currentState,
          ...typedState,
          // A slot added after this browser last saved is absent from the
          // persisted record, and an undefined selection would load nothing at
          // all rather than the stock part.
          bodyParts: { ...DEFAULT_BODY_PARTS, ...typedState.bodyParts },
          settings: {
            ...DEFAULT_SETTINGS,
            ...(persisted as unknown as Partial<Settings>),
            springRateLbIn:
              typedState.settings?.springRateLbIn ??
              legacySpringRateLbIn ??
              DEFAULT_SETTINGS.springRateLbIn,
          },
        };
      },
    }
  )
);
