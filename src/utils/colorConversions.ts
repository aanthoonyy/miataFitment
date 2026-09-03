// The picker works in HSV because that is the shape of a colour wheel: hue
// around the rim, saturation out from a white centre, and value on its own
// slider. Everything else -- the store, what it persists, and Three.js --
// speaks hex, so these are the only two conversions needed.

export interface Hsv {
  hueDeg: number;
  // Both 0..1.
  saturation: number;
  value: number;
}

function toHexPair(channel: number): string {
  return Math.round(channel * 255)
    .toString(16)
    .padStart(2, "0");
}

export function hsvToHex({ hueDeg, saturation, value }: Hsv): string {
  const channel = (offset: number) => {
    const k = (offset + hueDeg / 60) % 6;
    return value - value * saturation * Math.max(0, Math.min(k, 4 - k, 1));
  };
  return `#${toHexPair(channel(5))}${toHexPair(channel(3))}${toHexPair(channel(1))}`;
}

export function hexToHsv(hex: string): Hsv {
  const packed = parseInt(hex.replace("#", ""), 16);
  const red = ((packed >> 16) & 255) / 255;
  const green = ((packed >> 8) & 255) / 255;
  const blue = (packed & 255) / 255;

  const value = Math.max(red, green, blue);
  const range = value - Math.min(red, green, blue);

  // Grey has no hue to recover, and the sextant formula would divide by zero
  // trying to find one.
  let sextant = 0;
  if (range) {
    if (value === red) sextant = ((green - blue) / range) % 6;
    else if (value === green) sextant = (blue - red) / range + 2;
    else sextant = (red - green) / range + 4;
  }

  return {
    hueDeg: (sextant * 60 + 360) % 360,
    saturation: value ? range / value : 0,
    value,
  };
}
