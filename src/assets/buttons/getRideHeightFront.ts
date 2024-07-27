function getRideHeightFront() {
    let rideHeight = document.getElementById('rideHeightFront') as HTMLInputElement;
    let ride = rideHeight?.value ? parseFloat(rideHeight?.value) : 20;
    return ride;
}

export { getRideHeightFront };