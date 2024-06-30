function getRideHeight() {
    let rideHeight = document.getElementById('rideHeight') as HTMLInputElement;
    let ride = rideHeight?.value ? parseFloat(rideHeight?.value) : 20;
    console.log(ride);
    return ride;
}

export { getRideHeight };