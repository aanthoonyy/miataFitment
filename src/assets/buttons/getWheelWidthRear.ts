function getWheelWidthRear() {
    let wheelWidthInput = document.getElementById('rearWheelWidth') as HTMLInputElement;

    let wheelWidth = wheelWidthInput?.value ? parseFloat(wheelWidthInput?.value) : 8;

    return wheelWidth;
}

export { getWheelWidthRear };