import { camberSlider } from "./sliders/CamberSlider";

export function makeWheels(THREE: any, x: number, y: number, z: number) {
    const wheelGeometry = new THREE.CylinderGeometry(7/12, 7/12, 8/12, 32);
    const wheelMaterial = new THREE.MeshBasicMaterial({color: 0xC0C0C0, transparent: true, opacity: 0.5});
    const wheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
    
    // const test = new THREE.CylinderGeometry(7/12, 7/12, 4/12, 32);
    // const testa = new THREE.MeshBasicMaterial({color: 0x00000, transparent: true, opacity: 0.5});
    // const test2 = new THREE.Mesh(test, testa);
    // test2.position.y = 2/12;   
    // wheel.add(test2);
    // Rotate the wheel 90 degrees around the x-axis
    wheel.rotation.x = Math.PI / 2;
    wheel.position.x = x;
    wheel.position.z = y;
    wheel.position.y = z;

    return wheel;
}