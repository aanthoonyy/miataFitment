import { getCamberFront } from "./getCamberFront";

function getWheelSpacer() {
    let wheelSpacerInput = document.getElementById('wheelSpacer') as HTMLInputElement;
    let wheelSpacer = wheelSpacerInput?.value ? parseFloat(wheelSpacerInput?.value) : 0;

    let camberAngle = getCamberFront();

    let camberAngleRadians = camberAngle * (Math.PI / 180);

    let adjustedSpacer = -(wheelSpacer / 25.4) * Math.cos(camberAngleRadians);

    return adjustedSpacer;
}

export { getWheelSpacer };