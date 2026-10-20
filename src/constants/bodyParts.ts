import type { CarModel } from "@/constants/wheelPositions";
import { STRINGS } from "@/i18n/strings";

export const BODY_SLOTS = [
  "bumperFront", "bumperRear", "fendersFront", "flaresFront", "flaresRear",
  "skirts", "roof", "wing", "headlights", "rack",
] as const;

export type BodySlot = (typeof BODY_SLOTS)[number];
export type BodyParts = Record<BodySlot, string>;

interface BodyPart {
  value: string;
  label: string;
  model: string | null;
  fits?: readonly CarModel[];
}

export const STOCK_BODY_PART = "stock";
const SPLIT_SHELL: readonly CarModel[] = ["na", "nc"];
const WHOLE_SHELL: readonly CarModel[] = ["nb", "nd"];

const stockPart = (fits?: readonly CarModel[]): BodyPart => ({
  value: STOCK_BODY_PART, label: STRINGS.car.bodyPartNames.stock, model: null, fits,
});

const naStockPart = (slot: string): BodyPart => ({
  value: STOCK_BODY_PART,
  label: STRINGS.car.bodyPartNames.stock,
  model: `/body/na/${slot}/stock.glb`,
  fits: SPLIT_SHELL,
});

const BODY_PARTS: Record<BodySlot, readonly BodyPart[]> = {
  bumperFront: [
    naStockPart("bumper-front"), stockPart(WHOLE_SHELL),
    { value: "ak", label: STRINGS.car.bodyPartNames.FrontBarAK, model: "/body/na/bumper-front/ak.glb", fits: ["na"] },
    { value: "bn", label: STRINGS.car.bodyPartNames.FrontBarBN, model: "/body/na/bumper-front/bn.glb", fits: ["na"] },
    { value: "hy", label: STRINGS.car.bodyPartNames.FrontBarHY, model: "/body/na/bumper-front/hy.glb", fits: ["na"] },
    { value: "lip-1", label: STRINGS.car.bodyPartNames.FrontBarLip1, model: "/body/na/bumper-front/lip-1.glb", fits: ["na"] },
    { value: "lip-2", label: STRINGS.car.bodyPartNames.FrontBarLip2, model: "/body/na/bumper-front/lip-2.glb", fits: ["na"] },
    { value: "lip-3", label: STRINGS.car.bodyPartNames.FrontBarLip3, model: "/body/na/bumper-front/lip-3.glb", fits: ["na"] },
    { value: "pitcrew", label: STRINGS.car.bodyPartNames.FrontBarPitcrew, model: "/body/na/bumper-front/pitcrew.glb", fits: ["na"] },
    { value: "wings-west", label: STRINGS.car.bodyPartNames.WingsWest, model: "/body/na/bumper-front/wings-west.glb", fits: ["na"] },
  ],
  bumperRear: [
    naStockPart("bumper-rear"), stockPart(WHOLE_SHELL),
    { value: "bn", label: STRINGS.car.bodyPartNames.RearBarBN, model: "/body/na/bumper-rear/bn.glb", fits: ["na"] },
    { value: "cut", label: STRINGS.car.bodyPartNames.RearBarCut, model: "/body/na/bumper-rear/cut.glb", fits: ["na"] },
    { value: "pitcrew", label: STRINGS.car.bodyPartNames.RearBarPitcrew, model: "/body/na/bumper-rear/pitcrew.glb", fits: ["na"] },
    { value: "pitcrew-2", label: STRINGS.car.bodyPartNames.RearBarPitcrew2, model: "/body/na/bumper-rear/pitcrew-2.glb", fits: ["na"] },
    { value: "wings-west", label: STRINGS.car.bodyPartNames.WingsWest, model: "/body/na/bumper-rear/wings-west.glb", fits: ["na"] },
  ],
  fendersFront: [
    naStockPart("fenders-front"), stockPart(WHOLE_SHELL),
    { value: "ak", label: STRINGS.car.bodyPartNames.GuardAK, model: "/body/na/fenders-front/ak.glb", fits: ["na"] },
    { value: "lipped", label: STRINGS.car.bodyPartNames.GuardLipped, model: "/body/na/fenders-front/lipped.glb", fits: ["na"] },
  ],
  flaresFront: [
    stockPart(),
    { value: "standard", label: STRINGS.car.bodyPartNames.FrontFlare, model: "/body/na/flares-front/standard.glb", fits: ["na"] },
    { value: "ak", label: STRINGS.car.bodyPartNames.FrontFlareAK, model: "/body/na/flares-front/ak.glb", fits: ["na"] },
  ],
  flaresRear: [
    stockPart(),
    { value: "standard", label: STRINGS.car.bodyPartNames.RearFlare, model: "/body/na/flares-rear/standard.glb", fits: ["na"] },
    { value: "ak", label: STRINGS.car.bodyPartNames.RearFlareAK, model: "/body/na/flares-rear/ak.glb", fits: ["na"] },
    { value: "bl", label: STRINGS.car.bodyPartNames.RearFlareBL, model: "/body/na/flares-rear/bl.glb", fits: ["na"] },
  ],
  skirts: [
    naStockPart("skirts"), stockPart(WHOLE_SHELL),
    { value: "ak", label: STRINGS.car.bodyPartNames.SideskirtsAK, model: "/body/na/skirts/ak.glb", fits: ["na"] },
    { value: "bn", label: STRINGS.car.bodyPartNames.SideskirtsBN, model: "/body/na/skirts/bn.glb", fits: ["na"] },
    { value: "fw", label: STRINGS.car.bodyPartNames.SideskirtsFW, model: "/body/na/skirts/fw.glb", fits: ["na"] },
    { value: "wings-west", label: STRINGS.car.bodyPartNames.WingsWest, model: "/body/na/skirts/wings-west.glb", fits: ["na"] },
  ],
  roof: [
    naStockPart("roof"), stockPart(WHOLE_SHELL),
    { value: "oem", label: STRINGS.car.bodyPartNames.RoofOEM, model: "/body/na/roof/oem.glb", fits: ["na"] },
    { value: "pc", label: STRINGS.car.bodyPartNames.RoofPC, model: "/body/na/roof/pc.glb", fits: ["na"] },
    { value: "fastback", label: STRINGS.car.bodyPartNames.RoofFastback, model: "/body/na/roof/fastback.glb", fits: ["na"] },
  ],
  wing: [
    stockPart(),
    { value: "ducktail", label: STRINGS.car.bodyPartNames.SpoilerDuck, model: "/body/na/wing/ducktail.glb", fits: ["na"] },
    { value: "lip-1", label: STRINGS.car.bodyPartNames.SpoilerLip1, model: "/body/na/wing/lip-1.glb", fits: ["na"] },
  ],
  headlights: [
    stockPart(),
    { value: "pitcrew", label: STRINGS.car.bodyPartNames.HeadlightsPitcrew, model: "/body/na/headlights/pitcrew.glb", fits: ["na"] },
  ],
  rack: [
    stockPart(),
    { value: "luggage", label: STRINGS.car.bodyPartNames.Rack, model: "/body/na/rack/luggage.glb", fits: ["na"] },
  ],
};

const SHELL_MODELS: Record<CarModel, string> = {
  na: "/na_render.glb", nb: "/nb_render.glb", nc: "/na_render.glb", nd: "/nd_render.glb",
};

export const DEFAULT_BODY_PARTS: BodyParts = Object.fromEntries(
  BODY_SLOTS.map((slot) => [slot, STOCK_BODY_PART]),
) as BodyParts;

export function shellModelPath(model: CarModel): string {
  return SHELL_MODELS[model];
}

export function bodyPartsFor(model: CarModel, slot: BodySlot): readonly BodyPart[] {
  return BODY_PARTS[slot].filter((part) => !part.fits || part.fits.includes(model));
}

export function slotsWithChoices(model: CarModel): readonly BodySlot[] {
  return BODY_SLOTS.filter((slot) => bodyPartsFor(model, slot).length > 1);
}

export function resolveBodyPart(model: CarModel, slot: BodySlot, value: string): string {
  return bodyPartsFor(model, slot).some((part) => part.value === value) ? value : STOCK_BODY_PART;
}

export function bodyPartModelPath(model: CarModel, slot: BodySlot, value: string): string | null {
  const resolved = resolveBodyPart(model, slot, value);
  return bodyPartsFor(model, slot).find((part) => part.value === resolved)?.model ?? null;
}

export function resolveBodyParts(model: CarModel, parts: BodyParts): BodyParts {
  const resolved = Object.fromEntries(
    BODY_SLOTS.map((slot) => [slot, resolveBodyPart(model, slot, parts[slot])]),
  ) as BodyParts;
  if (resolved.bumperFront === "pitcrew" || resolved.headlights === "pitcrew") {
    resolved.bumperFront = "pitcrew";
    resolved.headlights = "pitcrew";
  }
  // The fastback occupies the trunk mounting surface used by these accessories.
  if (resolved.roof === "fastback") {
    resolved.rack = STOCK_BODY_PART;
    resolved.wing = STOCK_BODY_PART;
  }
  return resolved;
}

export function selectBodyPart(parts: BodyParts, slot: BodySlot, value: string): BodyParts {
  const selected = { ...parts, [slot]: value };
  if (slot === "bumperFront") selected.headlights = value === "pitcrew" ? "pitcrew" : STOCK_BODY_PART;
  if (slot === "headlights") {
    if (value === "pitcrew") selected.bumperFront = "pitcrew";
    else if (selected.bumperFront === "pitcrew") selected.bumperFront = STOCK_BODY_PART;
  }
  if (slot === "roof" && value === "fastback") {
    selected.rack = STOCK_BODY_PART;
    selected.wing = STOCK_BODY_PART;
  }
  if ((slot === "rack" || slot === "wing") && value !== STOCK_BODY_PART && selected.roof === "fastback") {
    selected.roof = STOCK_BODY_PART;
  }
  return selected;
}
