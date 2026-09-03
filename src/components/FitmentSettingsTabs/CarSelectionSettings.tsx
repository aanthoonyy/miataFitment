import { Link as RouterLink } from "react-router-dom";

import { Label } from "@/components/ui/label";
import { SettingsCard } from "@/components/ui/settings-card";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/hooks/useAuth";
import { useSetting } from "@/hooks/useSetting";
import { useFitmentStore, type CarModel } from "@/stores";
import { WHEEL_DESIGNS, type WheelDesign } from "@/constants/wheelDesigns";
import {
  BODY_SLOTS,
  bodyPartsFor,
  resolveBodyPart,
  type BodySlot,
} from "@/constants/bodyParts";
import { STRINGS } from "@/i18n/strings";
import CarColorPicker from "./CarColorPicker";

const SPRING_PRESETS = [
  { label: STRINGS.car.springPresets.floaty, value: 100 },
  { label: STRINGS.car.springPresets.stockish, value: 2500 },
  { label: STRINGS.car.springPresets.coilover, value: 7000 },
  { label: STRINGS.car.springPresets.stancy, value: 20000 },
] as const;

// Which generations can be picked, and which are modelled well enough to offer.
const GENERATIONS: readonly { value: CarModel; selectable: boolean }[] = [
  { value: "na", selectable: true },
  { value: "nb", selectable: true },
  { value: "nc", selectable: false },
  { value: "nd", selectable: true },
];

// Shown when a persisted rate is missing or corrupt, so the slider still has a
// preset to sit on.
const FALLBACK_SPRING_RATE_LB_IN = 2500;

function closestPresetIndex(springRateLbIn: number) {
  let bestIndex = 0;
  let bestDistance = Infinity;
  for (let index = 0; index < SPRING_PRESETS.length; index++) {
    const distance = Math.abs(springRateLbIn - SPRING_PRESETS[index].value);
    if (distance < bestDistance) {
      bestDistance = distance;
      bestIndex = index;
    }
  }
  return bestIndex;
}

const LoginPrompt = ({ action }: { action: string }) => (
  <p className="text-xs text-muted-foreground">
    {STRINGS.car.loginPrompt.split("{link}")[0]}
    <RouterLink
      to="/login"
      className="underline underline-offset-4 hover:text-foreground"
    >
      {STRINGS.car.loginPromptLink}
    </RouterLink>
    {STRINGS.car.loginPrompt.split("{link}")[1].replace("{action}", action)}
  </p>
);

// One slot of bodywork. Which slot is the parent's to say; everything about
// what is in it comes from the store.
const BodyPartSelect = ({ slot }: { slot: BodySlot }) => {
  const model = useFitmentStore((state) => state.model);
  const selected = useFitmentStore((state) => state.bodyParts[slot]);
  const setBodyPart = useFitmentStore((state) => state.setBodyPart);

  const parts = bodyPartsFor(model, slot);

  return (
    <div className="space-y-1.5">
      <Label className="text-xs text-muted-foreground">
        {STRINGS.car.bodySlots[slot]}
      </Label>
      <Select
        value={resolveBodyPart(model, slot, selected)}
        onValueChange={(value) => setBodyPart(slot, value)}
      >
        <SelectTrigger className="h-9">
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="max-h-72 bg-white text-black border shadow-md">
          {parts.map((part) => (
            <SelectItem key={part.value} value={part.value}>
              {part.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

const CarSelectionSettings = () => {
  const model = useFitmentStore((state) => state.model);
  const setModel = useFitmentStore((state) => state.setModel);
  const wheelDesign = useFitmentStore((state) => state.wheelDesign);
  const setWheelDesign = useFitmentStore((state) => state.setWheelDesign);
  const [springRateLbIn, setSpringRateLbIn] = useSetting("springRateLbIn");

  const { user, loading } = useAuth();

  const safeSpringRateLbIn = Number.isFinite(springRateLbIn)
    ? springRateLbIn
    : FALLBACK_SPRING_RATE_LB_IN;
  const presetIndex = closestPresetIndex(safeSpringRateLbIn);
  const showLoginPrompt = !user && !loading;

  return (
    <div className="space-y-4">
      <SettingsCard title={STRINGS.car.selectionTitle}>
        <div className="space-y-4">
          <div className="space-y-1.5">
            <div className="flex items-baseline justify-between gap-2">
              <Label className="text-xs text-muted-foreground">
                {STRINGS.car.generation}
              </Label>
              <span className="text-[11px] text-muted-foreground">
                {loading ? STRINGS.car.locked : STRINGS.car.editable}
              </span>
            </div>

            <Select
              value={model}
              onValueChange={(value) => setModel(value as CarModel)}
              disabled={loading}
            >
              <SelectTrigger className="h-9">
                <SelectValue placeholder={STRINGS.car.generationPlaceholder} />
              </SelectTrigger>

              <SelectContent className="bg-white text-black border shadow-md">
                {GENERATIONS.map((generation) => (
                  <SelectItem
                    key={generation.value}
                    value={generation.value}
                    disabled={!generation.selectable}
                  >
                    {STRINGS.car.generations[generation.value]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {showLoginPrompt ? (
              <LoginPrompt action={STRINGS.car.loginToChangeSelection} />
            ) : null}
          </div>

          <p className="text-sm text-muted-foreground leading-relaxed">
            {STRINGS.car.generationBlurb}
          </p>
        </div>
      </SettingsCard>

      <SettingsCard title={STRINGS.car.suspensionTitle}>
        <div className="space-y-4">
          <div className="space-y-1.5">
            <div className="flex items-baseline justify-between gap-2">
              <Label className="text-xs text-muted-foreground">
                {STRINGS.car.springRate}
              </Label>

              <span className="text-[11px] text-muted-foreground">
                {loading
                  ? STRINGS.car.locked
                  : SPRING_PRESETS[presetIndex].label}
              </span>
            </div>

            {/* Discrete 4-step slider: value is 0..3 */}
            <Slider
              value={[presetIndex]}
              min={0}
              max={SPRING_PRESETS.length - 1}
              step={1}
              onValueChange={([index]) =>
                setSpringRateLbIn(SPRING_PRESETS[index].value)
              }
              disabled={loading}
            />

            <div className="grid grid-cols-4 text-[10px] text-muted-foreground mt-2">
              {SPRING_PRESETS.map((preset, index) => (
                <div
                  key={preset.label}
                  className={[
                    "text-center",
                    index === presetIndex ? "text-foreground font-medium" : "",
                  ].join(" ")}
                >
                  {preset.label}
                </div>
              ))}
            </div>

            {showLoginPrompt ? (
              <LoginPrompt action={STRINGS.car.loginToChangeSuspension} />
            ) : null}

            <p className="text-xs text-muted-foreground">
              {STRINGS.car.springRateBlurb}
              <br />
              <strong>{STRINGS.car.springRateWip}</strong>
              {STRINGS.car.springRateWipRest}
            </p>
          </div>
        </div>
      </SettingsCard>

      <SettingsCard title={STRINGS.car.customizationTitle}>
        <div className="space-y-4">
          <CarColorPicker />

          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">
              {STRINGS.car.wheelDesign}
            </Label>
            <Select
              value={wheelDesign}
              onValueChange={(value) => setWheelDesign(value as WheelDesign)}
            >
              <SelectTrigger className="h-9">
                <SelectValue placeholder={STRINGS.car.wheelDesignPlaceholder} />
              </SelectTrigger>
              {/* Far more designs than fit on screen, so cap the list and let
                  it scroll rather than running the full window height. */}
              <SelectContent className="max-h-72 bg-white text-black border shadow-md">
                {WHEEL_DESIGNS.map((design) => (
                  <SelectItem key={design.value} value={design.value}>
                    {design.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {BODY_SLOTS.map((slot) => (
            <BodyPartSelect key={slot} slot={slot} />
          ))}

          <p className="text-xs text-muted-foreground">
            {STRINGS.car.customizationBlurb}
          </p>
        </div>
      </SettingsCard>
    </div>
  );
};

export default CarSelectionSettings;
