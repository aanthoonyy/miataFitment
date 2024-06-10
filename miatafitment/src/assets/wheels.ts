function barrelAndLipOffsetCalculation(totalWheelWidth: number) {
    // Calculate the offset based on the total wheel width
    // The offset decreases by 0.2 for each decrease of 1 in total wheel width
    const offset = 2 - (8 - totalWheelWidth) * 0.2;

    return offset;
}

export function makeWheels(THREE: any, x: number, y: number, z: number, wheelWidth: number, wheelDiameter: number) {
    const wheelGeometry = new THREE.CylinderGeometry(7/12, 7/12, 0.01/12, 32);
    const wheelMaterial = new THREE.MeshBasicMaterial({color: 0xC0C0C0, transparent: true, opacity: 0.5});
    const wheel = new THREE.Mesh(wheelGeometry, wheelMaterial);

    // Create two new cylinders
    // Create a geometry for the side cylinders of the wheel. The parameters specify the radius of the top face (7/12), 
    // the radius of the bottom face (7/12), the height of the cylinder (3/12), and the number of radial segments (32).
    const sideCylinderGeometry = new THREE.CylinderGeometry((wheelDiameter/2)/12, (wheelDiameter/2)/12, (wheelWidth/2)/12, 32);
    const sideCylinderMaterial = new THREE.MeshBasicMaterial({color: 0xC0C0C0, transparent: true, opacity: 0.5});

    // Add the cylinders to each side of the wheel
    const sideCylinder1 = new THREE.Mesh(sideCylinderGeometry, sideCylinderMaterial);
    sideCylinder1.position.y = barrelAndLipOffsetCalculation(wheelWidth)/12;
    wheel.add(sideCylinder1);

    const sideCylinder2 = new THREE.Mesh(sideCylinderGeometry, sideCylinderMaterial);
    sideCylinder2.position.y = -barrelAndLipOffsetCalculation(wheelWidth)/12;
    wheel.add(sideCylinder2);

    // Rotate the wheel 90 degrees around the x-axis
    wheel.rotation.x = Math.PI / 2;
    wheel.position.x = x;
    wheel.position.z = y;
    wheel.position.y = z;

    wheel.position.z += 0.5/12

    return wheel;
}