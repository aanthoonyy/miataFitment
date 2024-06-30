function getToeRear() {
    let toeInput  = document.getElementById('rearToe') as HTMLInputElement;

    let toe = toeInput?.value ? parseFloat(toeInput?.value) : 0;
    
    return toe;
}

export { getToeRear };