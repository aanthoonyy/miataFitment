import { camberSlider } from "./sliders/CamberSlider";

export function makeWheels(THREE: any, x: number, y: number, z: number) {
    const wheelGeometry = new THREE.CylinderGeometry(7/12, 7/12, 0.01/12, 32);
    const wheelMaterial = new THREE.MeshBasicMaterial({color: 0xC0C0C0, transparent: true, opacity: 0.5});
    const wheel = new THREE.Mesh(wheelGeometry, wheelMaterial);

    // Create two new cylinders
    const sideCylinderGeometry = new THREE.CylinderGeometry(7/12, 7/12, 3/12, 32);
    const sideCylinderMaterial = new THREE.MeshBasicMaterial({color: 0xC0C0C0, transparent: true, opacity: 0.5});

    // Add the cylinders to each side of the wheel
    const sideCylinder1 = new THREE.Mesh(sideCylinderGeometry, sideCylinderMaterial);
    sideCylinder1.position.y = wheel.position.y + 1.6/12;
    wheel.add(sideCylinder1);

    const sideCylinder2 = new THREE.Mesh(sideCylinderGeometry, sideCylinderMaterial);
    sideCylinder2.position.y = -1.6/12;
    wheel.add(sideCylinder2);

    // Rotate the wheel 90 degrees around the x-axis
    wheel.rotation.x = Math.PI / 2;
    wheel.position.x = x;
    wheel.position.z = y;
    wheel.position.y = z;

    return wheel;
}