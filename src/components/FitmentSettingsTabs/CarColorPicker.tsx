import { useCallback } from "react";

import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { CAR_COLOR_PRESETS } from "@/constants/carColors";
import { useFitmentStore } from "@/stores";
import { hexToHsv, hsvToHex } from "@/utils/colorConversions";
import { STRINGS } from "@/i18n/strings";

// The rim of the wheel, drawn as a hue sweep with white washed out of the
// centre so the radius reads as saturation.
const WHEEL_BACKGROUND = [
  "radial-gradient(circle closest-side, #fff, rgba(255,255,255,0))",
  "conic-gradient(#f00, #ff0, #0f0, #0ff, #00f, #f0f, #f00)",
].join(", ");

// Hue and saturation live in the hex, but only while there is some brightness
// left to carry them: at zero every colour is #000000 and dragging back up
// would come back grey. Near-black is still well within reach.
const MIN_VALUE_PERCENT = 5;

const DEGREES_PER_RADIAN = 180 / Math.PI;

const CarColorPicker = () => {
  const carColor = useFitmentStore((state) => state.carColor);
  const setCarColor = useFitmentStore((state) => state.setCarColor);

  const { hueDeg, saturation, value } = hexToHsv(carColor);

  // Anywhere on the wheel is a hue and a saturation; brightness is the
  // slider's to say, so it rides through untouched.
  const pickFromWheel = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      const bounds = event.currentTarget.getBoundingClientRect();
      const radius = bounds.width / 2;
      const x = event.clientX - bounds.left - radius;
      const y = event.clientY - bounds.top - radius;

      setCarColor(
        hsvToHex({
          // Measured clockwise from the top, which is where the conic gradient
          // starts, so the colour under the pointer is the colour picked.
          hueDeg: (Math.atan2(x, -y) * DEGREES_PER_RADIAN + 360) % 360,
          saturation: Math.min(1, Math.hypot(x, y) / radius),
          value,
        }),
      );
    },
    [setCarColor, value],
  );

  const trackPointer = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (!event.buttons) return;
      pickFromWheel(event);
    },
    [pickFromWheel],
  );

  const grabPointer = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      // Without the capture a fast drag off the wheel drops the gesture, and
      // the marker sticks wherever the pointer left.
      event.currentTarget.setPointerCapture(event.pointerId);
      pickFromWheel(event);
    },
    [pickFromWheel],
  );

  const markerAngleRad = hueDeg / DEGREES_PER_RADIAN;

  return (
    <div className="space-y-3">
      <div className="flex items-baseline justify-between gap-2">
        <Label className="text-xs text-muted-foreground">
          {STRINGS.car.color}
        </Label>
        <span className="text-[11px] font-mono text-muted-foreground">
          {carColor.toUpperCase()}
        </span>
      </div>

      <div className="flex items-center gap-4">
        <div
          className="relative h-40 w-40 shrink-0 rounded-full border cursor-crosshair touch-none"
          style={{ backgroundImage: WHEEL_BACKGROUND, filter: `brightness(${value})` }}
          onPointerDown={grabPointer}
          onPointerMove={trackPointer}
        >
          <div
            className="absolute h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow ring-1 ring-black/40 pointer-events-none"
            style={{
              left: `${50 + 50 * saturation * Math.sin(markerAngleRad)}%`,
              top: `${50 - 50 * saturation * Math.cos(markerAngleRad)}%`,
              backgroundColor: carColor,
            }}
          />
        </div>

        <div className="flex-1 space-y-3">
          <div
            className="h-12 w-full rounded-md border"
            style={{ backgroundColor: carColor }}
          />

          <div className="grid grid-cols-4 gap-2">
            {CAR_COLOR_PRESETS.map((preset) => (
              <button
                key={preset.key}
                type="button"
                title={STRINGS.car.colors[preset.key]}
                aria-label={STRINGS.car.colors[preset.key]}
                onClick={() => setCarColor(preset.hex)}
                className={[
                  "h-7 w-full rounded-md border transition",
                  carColor.toLowerCase() === preset.hex
                    ? "ring-2 ring-offset-1 ring-foreground"
                    : "hover:scale-105",
                ].join(" ")}
                style={{ backgroundColor: preset.hex }}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-1.5">
        <Label className="text-xs text-muted-foreground">
          {STRINGS.car.colorBrightness}
        </Label>
        <Slider
          value={[Math.round(value * 100)]}
          min={MIN_VALUE_PERCENT}
          max={100}
          step={1}
          onValueChange={([percent]) =>
            setCarColor(hsvToHex({ hueDeg, saturation, value: percent / 100 }))
          }
        />
      </div>
    </div>
  );
};

export default CarColorPicker;
