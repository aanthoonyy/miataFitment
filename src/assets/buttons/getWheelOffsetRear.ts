import { getCamberRear } from "./getCamberRear";

function getWheelOffsetRear() {
    let wheelOffsetInput = document.getElementById('rearWheelOffset') as HTMLInputElement;
    let wheelOffset = wheelOffsetInput?.value ? parseFloat(wheelOffsetInput?.value) : 0;

    let camberAngle = getCamberRear();

    let camberAngleRadians = camberAngle * (Math.PI / 180);

    let adjustedOffset = (wheelOffset / 25.4) * Math.cos(camberAngleRadians);

    return adjustedOffset;
}

export { getWheelOffsetRear };