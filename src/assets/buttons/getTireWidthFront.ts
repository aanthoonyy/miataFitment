function getTireWidthFront() {
    let tireWidthInput = document.getElementById('frontTireWidth') as HTMLInputElement;

    let tireSidewall = tireWidthInput?.value ? parseFloat(tireWidthInput?.value) : 14;
    return tireSidewall;
}

export { getTireWidthFront };