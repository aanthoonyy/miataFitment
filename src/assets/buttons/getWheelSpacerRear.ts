import { getCamberRear } from "./getCamberRear";

function getWheelSpacerRear() {
    let wheelSpacerInput = document.getElementById('rearWheelSpacer') as HTMLInputElement;
    let wheelSpacer = wheelSpacerInput?.value ? parseFloat(wheelSpacerInput?.value) : 0;

    let camberAngle = getCamberRear();

    let camberAngleRadians = camberAngle * (Math.PI / 180);

    let adjustedSpacer = -(wheelSpacer / 25.4) * Math.cos(camberAngleRadians);

    return adjustedSpacer;
}

export { getWheelSpacerRear };