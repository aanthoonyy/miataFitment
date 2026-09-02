// Body parts are a visual choice layered on top of a generation's shell: the
// shell holds everything that never swaps (cabin, roof, doors, glass, lights)
// and each slot below holds one piece that does.
//
// To add a part: export the .glb from the car's origin with nothing centred or
// re-zeroed, drop it in public/, and add a line to the slot's list. Nothing
// else. A part that shares the car's origin needs no placement code at all --
// it is added straight to the chassis group, which carries the one transform
// the whole car shares.
//
// Labels are shown as-is in the picker; rename them freely, but leave `value`
// alone once shipped, since it is what gets persisted in the user's browser.

import type { CarModel } from "@/constants/wheelPositions";

// Every slot, in the order the picker lists them.
export const BODY_SLOTS = [
  "bumperFront",
  "bumperRear",
  "fendersFront",
  "fendersRear",
  "skirts",
  "hood",
  "wing",
  "mirrors",
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
// part is already inside the shell and has nothing of its own to load. When a
// generation's stock panels get exported separately, this becomes a real path
// per slot and the shell loses them.
const stockPart = (): BodyPart => ({
  value: STOCK_BODY_PART,
  label: "Stock",
  model: null,
});

// Scaffolding, so a slot's load, attach and teardown path is exercisable before
// any real part exists. It is the whole NA body, so it lands exactly on top of
// the shell -- which is the point: a part needing no placement code is what the
// shared-origin export rule buys. Replace these with real parts as they land.
const placeholderPart = (): BodyPart => ({
  value: "placeholder",
  label: "Placeholder (na_render)",
  model: "/na_render.glb",
});

const BODY_PARTS: Record<BodySlot, readonly BodyPart[]> = {
  bumperFront: [stockPart(), placeholderPart()],
  bumperRear: [stockPart(), placeholderPart()],
  fendersFront: [stockPart(), placeholderPart()],
  fendersRear: [stockPart(), placeholderPart()],
  skirts: [stockPart(), placeholderPart()],
  hood: [stockPart(), placeholderPart()],
  wing: [stockPart(), placeholderPart()],
  mirrors: [stockPart(), placeholderPart()],
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
