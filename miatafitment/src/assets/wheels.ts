export function makeWheels(THREE: any, x: number, y: number, z: number) {
    const wheelGeometry = new THREE.CylinderGeometry(11.35/12, 11.35/12, 8.5/12, 32);
    const wheelMaterial = new THREE.MeshBasicMaterial({color: 0xC0C0C0});
    const wheel = new THREE.Mesh(wheelGeometry, wheelMaterial);


    // Rotate the wheel 90 degrees around the x-axis
    wheel.rotation.x = Math.PI / 2;
    wheel.position.x = x;
    wheel.position.z = y;
    wheel.position.y = z;

    return wheel;
}