function getWheelWidthFront() {
    let wheelWidthInput = document.getElementById('frontWheelWidth') as HTMLInputElement;

    let wheelWidth = wheelWidthInput?.value ? parseFloat(wheelWidthInput?.value) : 8;

    return wheelWidth;
}

export { getWheelWidthFront };