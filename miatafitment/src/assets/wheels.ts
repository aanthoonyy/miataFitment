export function makeWheels(THREE: any, x: number, y: number, z: number) {
    const geometry = new THREE.CylinderGeometry(11.35/12, 11.35/12, 7/12, 32);
    const material = new THREE.MeshBasicMaterial({color: 0xC0C0C0});
    const cylinder = new THREE.Mesh(geometry, material);

    // Rotate the cylinder 90 degrees around the x-axis
    cylinder.rotation.x = Math.PI / 2;
    cylinder.position.x = x;
    cylinder.position.z = y;
    cylinder.position.y = z;

    return cylinder;
}