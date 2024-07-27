import { getCamberFront } from "./getCamberFront";

function getWheelSpacerFront() {
    let wheelSpacerInput = document.getElementById('frontWheelSpacer') as HTMLInputElement;
    let wheelSpacer = wheelSpacerInput?.value ? parseFloat(wheelSpacerInput?.value) : 0;

    let camberAngle = getCamberFront();

    let camberAngleRadians = camberAngle * (Math.PI / 180);

    let adjustedSpacer = -(wheelSpacer / 25.4) * Math.cos(camberAngleRadians);

    return adjustedSpacer;
}

export { getWheelSpacerFront };