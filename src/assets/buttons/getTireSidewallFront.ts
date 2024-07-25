function getTireSidewallFront() {
    let tireSidewallInput = document.getElementById('frontTireSidewall') as HTMLInputElement;

    let tireSidewall = tireSidewallInput?.value ? parseFloat(tireSidewallInput?.value) : 14;
    return tireSidewall;
}

export { getTireSidewallFront };