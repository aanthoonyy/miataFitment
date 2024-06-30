function getTireWidth() {
    let tireWidthInput = document.getElementById('tireWidth') as HTMLInputElement;

    let tireSidewall = tireWidthInput?.value ? parseFloat(tireWidthInput?.value) : 14;
    return tireSidewall;
}

export { getTireWidth };