// Paint is a free-form hex, not a closed list: the wheel can reach anything, so
// these presets are shortcuts rather than the set of legal values.
//
// Classic Red is the colour the models are authored in, converted from the
// baseColorFactor the .glb carries, so the default look is unchanged.

export const CAR_COLOR_PRESETS = [
  { key: "classicRed", hex: "#b31818" },
  { key: "marinerBlue", hex: "#3a5f8f" },
  { key: "britishRacingGreen", hex: "#1c3a30" },
  { key: "sunburstYellow", hex: "#f2c318" },
  { key: "crystalWhite", hex: "#e8e8e8" },
  { key: "brilliantBlack", hex: "#141414" },
  { key: "silverStone", hex: "#b6babd" },
] as const;

export type CarColorPreset = (typeof CAR_COLOR_PRESETS)[number]["key"];

export const DEFAULT_CAR_COLOR = "#b31818";
export const DEFAULT_CAR_METALLIC = false;

// The paint settings resolved into the one shape the renderer takes, so the
// body never picks the store apart itself.
export interface CarPaint {
  hex: string;
  metallic: boolean;
}
