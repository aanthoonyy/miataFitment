function getWheelDiameterRear() {
    let wheelDiameterInput = document.getElementById('rearWheelDiameter') as HTMLInputElement;

    let wheelDiameter = wheelDiameterInput?.value ? parseFloat(wheelDiameterInput?.value) : 14;
    return wheelDiameter + 1;
}

export { getWheelDiameterRear };