let rideHeight = 100

function setRideHeightFront(r: any) {
    console.log('setRideHeightFront', r);
    rideHeight = parseFloat(r);
}

function getRideHeightFront() {
    // let rideHeight = document.getElementById('rideHeightFront') as HTMLInputElement;
    let ride = rideHeight ? rideHeight : 20;
    return ride;
}

export { getRideHeightFront, setRideHeightFront };