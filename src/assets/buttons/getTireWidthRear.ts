function getTireWidthRear() {
    let tireWidthInput = document.getElementById('rearTireWidth') as HTMLInputElement;

    let tireSidewall = tireWidthInput?.value ? parseFloat(tireWidthInput?.value) : 14;
    return tireSidewall;
}

export { getTireWidthRear };