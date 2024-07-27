function getTireSidewallRear() {
    let tireSidewallInput = document.getElementById('rearTireSidewall') as HTMLInputElement;

    let tireSidewall = tireSidewallInput?.value ? parseFloat(tireSidewallInput?.value) : 14;
    return tireSidewall;
}

export { getTireSidewallRear };