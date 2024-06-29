function getTireWidth() {
    let tireWidthInput = document.getElementById('tireWidth') as HTMLInputElement;

    let tireSidewall = tireWidthInput?.value ? parseFloat(tireWidthInput?.value) : 14;
    console.log(tireSidewall);
    return tireSidewall;
}

export { getTireWidth };