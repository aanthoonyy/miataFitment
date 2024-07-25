function getRideHeightRear() {
    let rideHeight = document.getElementById('rideHeightRear') as HTMLInputElement;
    let ride = rideHeight?.value ? parseFloat(rideHeight?.value) : 20;
    return ride;
}

export { getRideHeightRear };