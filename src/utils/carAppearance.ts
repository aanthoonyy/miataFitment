import { resolveBodyParts, type BodyParts } from "@/constants/bodyParts";
import { DEFAULT_CAR_COLOR, DEFAULT_CAR_METALLIC, type CarPaint } from "@/constants/carColors";
import type { CarModel } from "@/constants/wheelPositions";

export interface CarAppearance {
  parts: BodyParts;
  paint: CarPaint;
}

export function readCarAppearance(model: CarModel, input: unknown): CarAppearance {
  const raw = input && typeof input === "object" ? input as Record<string, unknown> : {};
  const parts = raw.parts && typeof raw.parts === "object" ? raw.parts as Partial<BodyParts> : {};
  const paint = raw.paint && typeof raw.paint === "object" ? raw.paint as Partial<CarPaint> : {};
  return {
    parts: resolveBodyParts(model, parts),
    paint: {
      hex: typeof paint.hex === "string" && /^#[0-9a-f]{6}$/i.test(paint.hex) ? paint.hex : DEFAULT_CAR_COLOR,
      metallic: typeof paint.metallic === "boolean" ? paint.metallic : DEFAULT_CAR_METALLIC,
    },
  };
}
