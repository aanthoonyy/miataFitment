import { Label } from "@/components/ui/label";
import { SettingsCard } from "@/components/ui/settings-card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { bodyPartsFor, slotsWithChoices, type BodySlot } from "@/constants/bodyParts";
import { WHEEL_DESIGNS, type WheelDesign } from "@/constants/wheelDesigns";
import { useFitmentStore } from "@/stores";
import { STRINGS } from "@/i18n/strings";
import CarColorPicker from "./CarColorPicker";

// One slot of bodywork. Which slot is the parent's to say; everything about
// what is in it comes from the store.
const BodyPartSelect = ({ slot }: { slot: BodySlot }) => {
  const model = useFitmentStore((state) => state.model);
  const selected = useFitmentStore((state) => state.appearance.parts[slot]);
  const setBodyPart = useFitmentStore((state) => state.setBodyPart);

  const parts = bodyPartsFor(model, slot);

  return (
    <div className="space-y-1.5">
      <Label className="text-xs text-muted-foreground">
        {STRINGS.car.bodySlots[slot]}
      </Label>
      <Select
        value={selected}
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

export function CarCustomizationSettings() {
  const model = useFitmentStore((state) => state.model);
  const wheelDesign = useFitmentStore((state) => state.wheelDesign);
  const setWheelDesign = useFitmentStore((state) => state.setWheelDesign);

  return (
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

          {slotsWithChoices(model).map((slot) => (
            <BodyPartSelect key={slot} slot={slot} />
          ))}

          <p className="text-xs text-muted-foreground">
            {STRINGS.car.customizationBlurb}
          </p>
        </div>
      </SettingsCard>
  );
}
