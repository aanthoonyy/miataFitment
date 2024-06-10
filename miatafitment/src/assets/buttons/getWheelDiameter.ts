function getWheelDiameter() {
    let wheelDiameterInput = document.getElementById('wheelDiameter') as HTMLInputElement;

    let wheelDiameter = wheelDiameterInput?.value ? parseFloat(wheelDiameterInput?.value) : 14;
    console.log(wheelDiameter);
    return wheelDiameter;
}

export { getWheelDiameter };