import { getCamberFront } from "./getCamberFront";

function getWheelOffset() {
    let wheelOffsetInput = document.getElementById('wheelOffset') as HTMLInputElement;
    let wheelOffset = wheelOffsetInput?.value ? parseFloat(wheelOffsetInput?.value) : 0;

    let camberAngle = getCamberFront();

    let camberAngleRadians = camberAngle * (Math.PI / 180);

    let adjustedOffset = (wheelOffset / 25.4) * Math.cos(camberAngleRadians);

    return adjustedOffset;
}

export { getWheelOffset };