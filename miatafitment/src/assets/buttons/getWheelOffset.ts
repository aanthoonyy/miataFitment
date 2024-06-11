function getWheelOffset() {
    let wheelOffsetInput = document.getElementById('wheelOffset') as HTMLInputElement;

    let wheelOffset = wheelOffsetInput?.value ? parseFloat(wheelOffsetInput?.value) : 8;

    return wheelOffset / 25.4;
}

export { getWheelOffset };