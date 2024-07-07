import milliMeterToInch from "./MilliMeterToInch";

export default function rollingDiameter(wheelDiameter: number, tireWidth: number, tireSideWall: number) {
    let sidewallHeightInInches = milliMeterToInch(tireWidth * (tireSideWall / 100));
    let totalDiameter = wheelDiameter + (2 * sidewallHeightInInches);
    console.log(totalDiameter)
    return totalDiameter;
}