// The only place a unit conversion is spelled out.
//
// This codebase mixes four units — Three.js scene feet, spec inches, offset
// millimetres and angles — and the type system cannot tell a number in one from
// a number in another. Names carry the unit (see CONVENTIONS.md §5) and every
// crossing between them goes through a function here, so there is one place to
// be wrong rather than a dozen.

// Exported for the few places that need the factor rather than a conversion —
// scaling a loaded model, or dividing a whole vector — so even those do not
// respell the number.
export const MM_PER_INCH = 25.4;
export const INCHES_PER_FOOT = 12;

export const mmToInches = (mm: number): number => mm / MM_PER_INCH;
export const inchesToMm = (inches: number): number => inches * MM_PER_INCH;

export const inchesToFeet = (inches: number): number => inches / INCHES_PER_FOOT;
export const feetToInches = (feet: number): number => feet * INCHES_PER_FOOT;

export const mmToFeet = (mm: number): number => inchesToFeet(mmToInches(mm));

const DEGREES_PER_HALF_TURN = 180;

export const radiansToDegrees = (radians: number): number =>
  radians * DEGREES_PER_HALF_TURN / Math.PI;
