function getWheelSpacer() {
    let wheelSpacerInput = document.getElementById('wheelSpacer') as HTMLInputElement;

    let wheelSpacer = wheelSpacerInput?.value ? parseFloat(wheelSpacerInput?.value) : 0;

    return -wheelSpacer / 25.4;
}

export { getWheelSpacer  };