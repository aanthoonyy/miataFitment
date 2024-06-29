function getTireSidewall() {
    let tireSidewallInput = document.getElementById('tireSidewall') as HTMLInputElement;

    let tireSidewall = tireSidewallInput?.value ? parseFloat(tireSidewallInput?.value) : 14;
    console.log(tireSidewall);
    return tireSidewall;
}

export { getTireSidewall };