import type { SavedConfigPayload } from "@/types/garage";
import { readFitmentConfig } from "./fitmentConfig";
import { radiansToDegrees } from "./unitConversions";

function isNum(v: unknown): v is number {
  return typeof v === "number" && Number.isFinite(v);
}

function fmtDeg(n?: number) {
  return isNum(n) ? `${n.toFixed(1)}°` : null;
}

function fmtIn(n?: number) {
  return isNum(n) ? `${n.toFixed(1)}"` : null;
}

function fmtMm(n?: number) {
  return isNum(n) ? `${Math.round(n)}mm` : null;
}

function up(s?: string) {
  return typeof s === "string" && s.length ? s.toUpperCase() : null;
}

// Produces one nice single-line summary for your card
export function payloadToPreview(payload?: SavedConfigPayload): string | null {
  if (!payload || typeof payload !== "object") return null;

  const config = readFitmentConfig(payload);
  const model = up(config.model);
  const s = config.settings;

  // Wheels
  const fw = fmtIn(s.frontWheelWidthIn);
  const fd = fmtIn(s.frontWheelDiameterIn);
  const rw = fmtIn(s.rearWheelWidthIn);
  const rd = fmtIn(s.rearWheelDiameterIn);

  const frontWheel = fw && fd ? `${fd}x${fw}F` : null;
  const rearWheel = rw && rd ? `${rd}x${rw}R` : null;

  // Alignment
  const fc = fmtDeg(s.frontCamberDeg);
  const rc = fmtDeg(s.rearCamberDeg);
  const ft = fmtDeg(radiansToDegrees(s.frontToeRad));
  const rt = fmtDeg(radiansToDegrees(s.rearToeRad));

  // Offset/spacer (mm)
  const fOff = fmtMm(s.frontWheelOffsetMm);
  const rOff = fmtMm(s.rearWheelOffsetMm);
  const fSp = fmtMm(s.frontWheelSpacerMm);
  const rSp = fmtMm(s.rearWheelSpacerMm);

  const parts: string[] = [];

  if (model) parts.push(model);
  if (frontWheel || rearWheel) parts.push([frontWheel, rearWheel].filter(Boolean).join(" • "));

  const camberPart = [fc ? `F ${fc}` : null, rc ? `R ${rc}` : null].filter(Boolean).join(" • ");
  if (camberPart) parts.push(`Camber: ${camberPart}`);

  const toePart = [ft ? `F ${ft}` : null, rt ? `R ${rt}` : null].filter(Boolean).join(" • ");
  if (toePart) parts.push(`Toe: ${toePart}`);

  const offPart = [fOff ? `F ${fOff}` : null, rOff ? `R ${rOff}` : null].filter(Boolean).join(" • ");
  if (offPart) parts.push(`Offset: ${offPart}`);

  const spPart = [fSp ? `F ${fSp}` : null, rSp ? `R ${rSp}` : null].filter(Boolean).join(" • ");
  if (spPart) parts.push(`Spacer: ${spPart}`);

  return parts.length ? parts.join(" — ") : null;
}
