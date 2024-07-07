function getToeFront() {
    let toeInput  = document.getElementById('frontToe') as HTMLInputElement;

    let toe = toeInput?.value ? parseFloat(toeInput?.value) : 0;
    
    return toe;
}

export { getToeFront };