function getWheelDiameterFront() {
    let wheelDiameterInput = document.getElementById('frontWheelDiameter') as HTMLInputElement;

    let wheelDiameter = wheelDiameterInput?.value ? parseFloat(wheelDiameterInput?.value) : 14;
    return wheelDiameter + 1;
}

export { getWheelDiameterFront };