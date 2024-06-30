function getCaster() {
    let casterSidewallInput = document.getElementById('frontCaster') as HTMLInputElement;

    let caster = casterSidewallInput?.value ? parseFloat(casterSidewallInput?.value) : 6.8;
    return caster;
}

export { getCaster };