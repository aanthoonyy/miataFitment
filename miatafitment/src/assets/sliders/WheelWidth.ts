function getWheelWidth() {
    let wheelWidthInput = document.getElementById('wheelWidth') as HTMLInputElement;

    let wheelWidth = wheelWidthInput?.value ? parseFloat(wheelWidthInput?.value) : 8;

    return wheelWidth;
}

export { getWheelWidth };