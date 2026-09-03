// Body parts are a visual choice layered on top of a generation's shell: the
// shell holds everything that never swaps (cabin, roof, doors, glass, lights)
// and each slot below holds one piece that does.
//
// To add a part: fit it against Miata_Body in the kit .blend, name it
// Miata_Aero_*, list it in scripts/export-na-body-parts.py, run that script,
// and add a line to the slot's list here. The export carries the object's
// transform, so a fitted part needs no placement code at all -- it is added
// straight to the chassis group, which carries the one transform the whole car
// shares.
//
// Labels are shown as-is in the picker; rename them freely, but leave `value`
// alone once shipped, since it is what gets persisted in the user's browser.

import type { CarModel } from "@/constants/wheelPositions";

// Every slot, in the order the picker lists them. A slot with nothing but its
// stock part is not shown, so listing one before its parts exist costs nothing.
export const BODY_SLOTS = [
  "bumperFront",
  "bumperRear",
  "fendersFront",
  "flaresFront",
  "flaresRear",
  "skirts",
  "roof",
  "wing",
  "headlights",
  "rack",
] as const;

export type BodySlot = (typeof BODY_SLOTS)[number];

// Which part is selected in each slot. Values are per-slot, so two slots may
// both hold "stock" without meaning the same part.
export type BodyParts = Record<BodySlot, string>;

interface BodyPart {
  value: string;
  label: string;
  // null when the part has no model of its own to load.
  model: string | null;
  // Which generations offer the part. Omitted means all of them.
  fits?: readonly CarModel[];
}

export const STOCK_BODY_PART = "stock";

// The stock car is still one body mesh per generation, so every slot's stock
// part is already inside the shell and has nothing of its own to load. Until
// the stock panels are split out, a part is drawn over the stock one rather
// than in place of it.
const stockPart = (): BodyPart => ({
  value: STOCK_BODY_PART,
  label: "Stock",
  model: null,
});

const BODY_PARTS: Record<BodySlot, readonly BodyPart[]> = {
  bumperFront: [
    stockPart(),
    {
      value: "bn",
      label: "BN Style",
      model: "/body/na/bumper-front/bn.glb",
      fits: ["na"],
    },
  ],
  bumperRear: [
    stockPart(),
    {
      value: "bn",
      label: "BN Style",
      model: "/body/na/bumper-rear/bn.glb",
      fits: ["na"],
    },
  ],
  fendersFront: [stockPart()],
  flaresFront: [stockPart()],
  flaresRear: [stockPart()],
  skirts: [
    stockPart(),
    {
      value: "bn",
      label: "BN Style",
      model: "/body/na/skirts/bn.glb",
      fits: ["na"],
    },
  ],
  roof: [stockPart()],
  wing: [stockPart()],
  headlights: [stockPart()],
  rack: [stockPart()],
};

// Everything that never swaps, for one generation.
const SHELL_MODELS: Record<CarModel, string> = {
  na: "/na_render.glb",
  nb: "/nb_render.glb",
  // There is no NC model yet and the generation is not selectable, but a shell
  // for every model means no path here can come up empty.
  nc: "/na_render.glb",
  nd: "/nd_render.glb",
};

export const DEFAULT_BODY_PARTS: BodyParts = Object.fromEntries(
  BODY_SLOTS.map((slot) => [slot, STOCK_BODY_PART]),
) as BodyParts;

export function shellModelPath(model: CarModel): string {
  return SHELL_MODELS[model];
}

// The parts a generation actually offers in a slot. A part with no `fits` is
// bodywork every generation shares.
export function bodyPartsFor(
  model: CarModel,
  slot: BodySlot,
): readonly BodyPart[] {
  return BODY_PARTS[slot].filter(
    (part) => !part.fits || part.fits.includes(model),
  );
}

// Slots worth showing: one holding nothing but the stock part is a dropdown
// with a single entry and no decision in it.
export function slotsWithChoices(model: CarModel): readonly BodySlot[] {
  return BODY_SLOTS.filter((slot) => bodyPartsFor(model, slot).length > 1);
}

// A selection made on one generation can name a part the next one does not
// offer, so the selection is resolved against the model everywhere it is read
// rather than being rewritten in the store when the generation changes.
export function resolveBodyPart(
  model: CarModel,
  slot: BodySlot,
  value: string,
): string {
  const offered = bodyPartsFor(model, slot).some((part) => part.value === value);
  return offered ? value : STOCK_BODY_PART;
}

export function bodyPartModelPath(
  model: CarModel,
  slot: BodySlot,
  value: string,
): string | null {
  const resolved = resolveBodyPart(model, slot, value);
  return (
    bodyPartsFor(model, slot).find((part) => part.value === resolved)?.model ??
    null
  );
}
